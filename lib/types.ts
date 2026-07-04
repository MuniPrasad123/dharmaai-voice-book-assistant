/**
 * lib/types.ts
 * TypeScript type definitions for DharmaAI
 * These types are shared across the app (API routes + frontend components)
 */

// ──────────────────────────────────────────────
// Chat types
// ──────────────────────────────────────────────

/**
 * Represents a single message in the chat window.
 * role: "user"      → sent by the person
 * role: "assistant" → sent by DharmaAI
 */
export interface ChatMessage {
  id: string; // unique ID for React key prop
  role: "user" | "assistant";
  content: string; // the text of the message
  timestamp: Date; // when the message was sent
  sources?: string[]; // retrieved chunks for this message
}

// ──────────────────────────────────────────────
// Local RAG Types
// ──────────────────────────────────────────────

export interface RAGChunk {
  id: string;
  text: string;
  embedding: number[];
}

export interface DocumentStore {
  bookId: string;
  bookName: string;
  chunks: RAGChunk[];
}

// ──────────────────────────────────────────────
// API response types
// ──────────────────────────────────────────────

export interface UploadBookResponse {
  bookId: string;
  bookName: string;
  totalChunks: number;
  status: string;
}

export interface ChatResponse {
  answer: string;
  sources: string[];
}

/**
 * Generic error response shape
 * Used when API routes return error JSON.
 */
export interface ApiError {
  error: string; // human-readable error message
}
