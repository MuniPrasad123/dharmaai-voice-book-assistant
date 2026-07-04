/**
 * app/api/chat/route.ts
 * API Route: POST /api/chat
 *
 * 1. Accepts a user question and a bookId.
 * 2. Computes the embedding for the user's question via Ollama.
 * 3. Loads the indexed book chunks from local JSON.
 * 4. Computes cosine similarity to find top 5 relevant chunks.
 * 5. Passes context to Ollama chat model to generate an answer.
 */

import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { ChatResponse, DocumentStore } from "@/lib/types";

/**
 * Calculates cosine similarity between two vectors.
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, bookId } = body; // Notice we use bookId instead of vectorStoreId

    if (!message || typeof message !== "string" || message.trim() === "") {
      return NextResponse.json({ error: "message is required." }, { status: 400 });
    }

    if (!bookId || typeof bookId !== "string" || bookId.trim() === "") {
      return NextResponse.json(
        { error: "bookId is required. Please upload a book first." },
        { status: 400 }
      );
    }

    const ollamaUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
    const chatModel = process.env.OLLAMA_CHAT_MODEL || "llama3.2:3b";
    const embedModel = process.env.OLLAMA_EMBEDDING_MODEL || "nomic-embed-text";

    // ── Step 1: Embed the user's question ────────────────────────────────────
    const embedResponse = await fetch(`${ollamaUrl}/api/embed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: embedModel,
        input: message,
      }),
    });

    if (!embedResponse.ok) {
      throw new Error(`Failed to embed question: ${await embedResponse.text()}`);
    }
    const embedData = await embedResponse.json();
    const questionEmbedding: number[] = embedData.embeddings[0];

    // ── Step 2: Load the local vector store (JSON) ───────────────────────────
    const filePath = path.join(process.cwd(), "data", "books", `${bookId}.json`);
    let fileContent: string;
    try {
      fileContent = await fs.readFile(filePath, "utf-8");
    } catch (err) {
      return NextResponse.json({ error: "Book not found. Please upload it again." }, { status: 404 });
    }
    
    const docStore: DocumentStore = JSON.parse(fileContent);

    // ── Step 3: Compute Similarity & Retrieve Top K Chunks ───────────────────
    const similarities = docStore.chunks.map((chunk) => ({
      chunk,
      score: cosineSimilarity(questionEmbedding, chunk.embedding),
    }));

    // Sort descending by score
    similarities.sort((a, b) => b.score - a.score);
    
    console.log("🔍 Top similarity scores:", similarities.slice(0, 5).map(s => s.score.toFixed(4)));

    // Fast-path bypass for completely unrelated questions
    const highestScore = similarities[0]?.score || 0;
    if (highestScore < 0.40) {
      console.log(`⚡ Fast-path rejected query due to low similarity score (${highestScore.toFixed(4)} < 0.40)`);
      const responsePayload: ChatResponse = {
        answer: "I could not find any relevant information in the uploaded book context.",
        sources: []
      };
      return NextResponse.json(responsePayload, { status: 200 });
    }

    // Pick Top 5
    const topChunks = similarities.slice(0, 5).map((s) => s.chunk.text);

    // ── Step 4: Construct Prompt and Call Ollama Chat API ────────────────────
    const contextText = topChunks.map((chunk, i) => `--- Snippet ${i + 1} ---\n${chunk}`).join("\n\n");
    
    const systemInstruction = `You are DharmaAI, a helpful book knowledge assistant. 
Answer the user's question based strictly on the uploaded book context provided below. 
If the answer is not found in the uploaded book context, clearly say "I could not find the answer in the uploaded book." 
Explain in simple English. For spiritual or epic content, explain respectfully and clearly.

Context:
${contextText}`;

    const chatResponse = await fetch(`${ollamaUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: chatModel,
        stream: false,
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: message.trim() }
        ],
      }),
    });

    if (!chatResponse.ok) {
      throw new Error(`Ollama chat failed: ${await chatResponse.text()}`);
    }

    const chatData = await chatResponse.json();
    const answer = chatData.message.content;

    // ── Step 5: Return the answer and sources ────────────────────────────────
    const responsePayload: ChatResponse = { 
      answer,
      sources: topChunks // Send sources to UI
    };
    return NextResponse.json(responsePayload, { status: 200 });

  } catch (error: unknown) {
    console.error("Error in /api/chat:", error);
    const message = error instanceof Error ? error.message : "Unknown error occurred.";
    return NextResponse.json({ error: `Chat failed: ${message}` }, { status: 500 });
  }
}
