/**
 * app/api/upload-book/route.ts
 * API Route: POST /api/upload-book
 *
 * Accepts a PDF file via multipart/form-data.
 * Steps:
 *  1. Validate file exists and is a PDF
 *  2. Extract text locally using pdf-parse
 *  3. Split text into overlapping chunks
 *  4. Generate embeddings for all chunks via local Ollama API
 *  5. Store chunks & embeddings locally in data/books/[bookId].json
 *  6. Return bookId, bookName, totalChunks, and status
 */

import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { DocumentStore, RAGChunk, UploadBookResponse } from "@/lib/types";

// Configuration for text chunking
const CHUNK_SIZE = 800;
const CHUNK_OVERLAP = 150;

/**
 * Splits text into overlapping chunks.
 */
function chunkText(text: string, size: number, overlap: number): string[] {
  // Simple word-based or character-based chunking. Let's do simple character chunking.
  // First, clean up the text (remove excessive newlines/spaces)
  const cleanText = text.replace(/\s+/g, " ").trim();
  
  const chunks: string[] = [];
  let i = 0;
  
  while (i < cleanText.length) {
    const chunk = cleanText.slice(i, i + size);
    chunks.push(chunk);
    if (i + size >= cleanText.length) {
      break;
    }
    // move forward by size minus overlap
    i += (size - overlap);
  }
  
  return chunks;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are accepted." }, { status: 400 });
    }

    // ── Step 1: Extract Text from PDF ────────────────────────────────────────
    const { extractTextFromPDF } = await import("@/lib/pdf-extract");
    const arrayBuffer = await file.arrayBuffer();
    const textContent = await extractTextFromPDF(new Uint8Array(arrayBuffer));
    
    if (!textContent || textContent.trim().length === 0) {
       return NextResponse.json({ error: "Could not extract text from this PDF." }, { status: 400 });
    }

    // ── Step 2: Chunk the Text ───────────────────────────────────────────────
    const chunks = chunkText(textContent, CHUNK_SIZE, CHUNK_OVERLAP);
    console.log(`✅ Extracted ${chunks.length} chunks from PDF.`);

    // ── Step 3: Generate Embeddings using local Ollama ───────────────────────
    const ollamaUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
    const embedModel = process.env.OLLAMA_EMBEDDING_MODEL || "nomic-embed-text";

    // Ollama /api/embed accepts an array of strings in "input"
    const embedResponse = await fetch(`${ollamaUrl}/api/embed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: embedModel,
        input: chunks,
      }),
    });

    if (!embedResponse.ok) {
      const errorText = await embedResponse.text();
      throw new Error(`Ollama embedding failed: ${errorText}`);
    }

    const embedData = await embedResponse.json();
    const embeddings: number[][] = embedData.embeddings;

    if (!embeddings || embeddings.length !== chunks.length) {
      throw new Error("Mismatch between number of chunks and returned embeddings.");
    }

    // ── Step 4: Map to RAGChunk objects ──────────────────────────────────────
    const ragChunks: RAGChunk[] = chunks.map((chunkText, index) => ({
      id: `chunk-${index}`,
      text: chunkText,
      embedding: embeddings[index],
    }));

    // ── Step 5: Save to local filesystem (data/books/) ───────────────────────
    const bookId = `book-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const documentStore: DocumentStore = {
      bookId,
      bookName: file.name,
      chunks: ragChunks,
    };

    const dataDir = path.join(process.cwd(), "data", "books");
    
    // Ensure directory exists
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }

    const filePath = path.join(dataDir, `${bookId}.json`);
    await fs.writeFile(filePath, JSON.stringify(documentStore), "utf-8");
    
    console.log(`✅ Indexed and saved book to ${filePath}`);

    // ── Step 6: Return Response ──────────────────────────────────────────────
    const response: UploadBookResponse = {
      bookId,
      bookName: file.name,
      totalChunks: chunks.length,
      status: "completed",
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error: unknown) {
    console.error("Error in /api/upload-book:", error);
    const message = error instanceof Error ? error.message : "Unknown error occurred.";
    return NextResponse.json({ error: `Upload failed: ${message}` }, { status: 500 });
  }
}
