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
}

// ──────────────────────────────────────────────
// API response types
// ──────────────────────────────────────────────

/**
 * Response returned by /api/upload-book
 * after a PDF is uploaded and indexed.
 */
export interface UploadBookResponse {
  fileId: string; // OpenAI file ID
  vectorStoreId: string; // OpenAI vector store ID
  bookName: string; // original filename of the PDF
  status: string; // e.g. "completed", "in_progress"
}

/**
 * Response returned by /api/chat
 * Contains the AI-generated answer.
 */
export interface ChatResponse {
  answer: string; // AI answer based on the uploaded book
}

/**
 * Response returned by /api/transcribe
 * Contains the transcribed text from user audio.
 */
export interface TranscribeResponse {
  text: string; // transcribed speech-to-text result
}

/**
 * Generic error response shape
 * Used when API routes return error JSON.
 */
export interface ApiError {
  error: string; // human-readable error message
}
