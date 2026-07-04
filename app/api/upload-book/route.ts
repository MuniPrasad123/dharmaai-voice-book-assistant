/**
 * app/api/upload-book/route.ts
 * API Route: POST /api/upload-book
 *
 * Accepts a PDF file via multipart/form-data.
 * Steps:
 *  1. Validate file exists and is a PDF
 *  2. Upload PDF to OpenAI Files API
 *  3. Create an OpenAI Vector Store
 *  4. Attach the file to the vector store (so it can be searched)
 *  5. Return fileId, vectorStoreId, bookName, and status
 *
 * Security: This runs server-side only. The OpenAI API key is never sent to the browser.
 */

import { NextRequest, NextResponse } from "next/server";
import openai from "@/lib/openai";
import { UploadBookResponse } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    // ── Step 1: Parse the incoming multipart form data ──────────────────────
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    // Validate that a file was actually provided
    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    // Validate that the uploaded file is a PDF
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are accepted." },
        { status: 400 }
      );
    }

    // ── Step 2: Upload the PDF to OpenAI Files API ───────────────────────────
    // Convert the File object to a Buffer that the OpenAI SDK can send
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // The OpenAI Files API needs a file-like object with a name and type
    const uploadedFile = await openai.files.create({
      file: new File([buffer], file.name, { type: "application/pdf" }),
      purpose: "assistants", // "assistants" purpose enables file search
    });

    console.log(`✅ File uploaded to OpenAI. File ID: ${uploadedFile.id}`);

    // ── Step 3: Create an OpenAI Vector Store ────────────────────────────────
    // A vector store is a searchable index of your document.
    // OpenAI will automatically chunk, embed, and index the PDF content.
    const vectorStore = await openai.vectorStores.create({
      name: `DharmaAI - ${file.name}`, // human-readable label for the store
    });

    console.log(`✅ Vector Store created. ID: ${vectorStore.id}`);

    // ── Step 4: Attach the PDF file to the vector store ─────────────────────
    // This triggers OpenAI to process and index the PDF content.
    // The file must finish processing before it can be searched.
    await openai.vectorStores.files.create(vectorStore.id, {
      file_id: uploadedFile.id,
    });

    console.log(`✅ File attached to Vector Store. Processing started.`);

    // ── Step 5: Poll until the file finishes being indexed ──────────────────
    // OpenAI processes files asynchronously. We poll until status = "completed"
    let status = "in_progress";
    let attempts = 0;
    const maxAttempts = 30; // wait up to ~60 seconds

    while (status === "in_progress" && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // wait 2 seconds
      const fileStatus = await openai.vectorStores.files.retrieve(
        vectorStore.id,
        uploadedFile.id
      );
      status = fileStatus.status;
      attempts++;
      console.log(`📄 Indexing status: ${status} (attempt ${attempts})`);
    }

    // ── Step 6: Return the result to the frontend ────────────────────────────
    const response: UploadBookResponse = {
      fileId: uploadedFile.id,
      vectorStoreId: vectorStore.id,
      bookName: file.name,
      status: status,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: unknown) {
    // Log the error server-side for debugging
    console.error("Error in /api/upload-book:", error);

    const message =
      error instanceof Error ? error.message : "Unknown error occurred.";

    return NextResponse.json(
      { error: `Upload failed: ${message}` },
      { status: 500 }
    );
  }
}
