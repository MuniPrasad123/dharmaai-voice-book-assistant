/**
 * app/api/chat/route.ts
 * API Route: POST /api/chat
 *
 * Accepts a user question and a vectorStoreId.
 * Uses the OpenAI Responses API with the file_search tool to:
 *  1. Search the uploaded PDF for relevant content
 *  2. Generate a contextual answer based on the book
 *
 * Security: Runs server-side only. API key never reaches the browser.
 */

import { NextRequest, NextResponse } from "next/server";
import openai from "@/lib/openai";
import { ChatResponse } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    // ── Step 1: Parse the request body ──────────────────────────────────────
    const body = await req.json();
    const { message, vectorStoreId } = body;

    // Validate required inputs
    if (!message || typeof message !== "string" || message.trim() === "") {
      return NextResponse.json(
        { error: "message is required and must be a non-empty string." },
        { status: 400 }
      );
    }

    if (
      !vectorStoreId ||
      typeof vectorStoreId !== "string" ||
      vectorStoreId.trim() === ""
    ) {
      return NextResponse.json(
        {
          error:
            "vectorStoreId is required. Please upload a book first.",
        },
        { status: 400 }
      );
    }

    // ── Step 2: Call the OpenAI Responses API with file_search ──────────────
    // The Responses API is OpenAI's newer stateless API.
    // The file_search tool allows the model to search the vector store for
    // relevant passages before generating an answer.
    const response = await openai.responses.create({
      model: process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini",
      instructions:
        "You are DharmaAI, a helpful book knowledge assistant. " +
        "Answer based on the uploaded book whenever possible. " +
        "If the answer is not found in the uploaded book content, clearly say it was not found in the uploaded content. " +
        "Explain in simple English. " +
        "For spiritual or epic content, explain respectfully and clearly.",
      input: message.trim(),
      tools: [
        {
          type: "file_search",
          vector_store_ids: [vectorStoreId],
        },
      ],
    });

    // ── Step 3: Extract the text answer from the response ───────────────────
    // The Responses API returns an output array; we find the message output
    let answer = "";

    for (const output of response.output) {
      if (output.type === "message") {
        for (const contentBlock of output.content) {
          if (contentBlock.type === "output_text") {
            answer += contentBlock.text;
          }
        }
      }
    }

    if (!answer) {
      answer =
        "I could not find a relevant answer in the uploaded book. Please try rephrasing your question.";
    }

    // ── Step 4: Return the answer ────────────────────────────────────────────
    const chatResponse: ChatResponse = { answer };
    return NextResponse.json(chatResponse, { status: 200 });
  } catch (error: unknown) {
    console.error("Error in /api/chat:", error);

    const message =
      error instanceof Error ? error.message : "Unknown error occurred.";

    return NextResponse.json(
      { error: `Chat failed: ${message}` },
      { status: 500 }
    );
  }
}
