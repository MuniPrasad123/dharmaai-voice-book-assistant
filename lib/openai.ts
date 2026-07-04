/**
 * lib/openai.ts
 * Singleton OpenAI client — SERVER SIDE ONLY
 *
 * ⚠️  IMPORTANT SECURITY NOTE:
 * This file must ONLY be imported inside API route files (app/api/**).
 * Never import this in client components, or the API key will be exposed!
 *
 * We read all configuration from environment variables so secrets
 * are never hardcoded in source code.
 */

import OpenAI from "openai";

// Validate that the API key is set before creating the client.
// This gives a clear error message during development if .env.local is missing.
if (!process.env.OPENAI_API_KEY) {
  throw new Error(
    "Missing OPENAI_API_KEY environment variable.\n" +
      "Please copy .env.local.example to .env.local and add your OpenAI API key."
  );
}

/**
 * The OpenAI client instance.
 * Initialized once and reused across all API requests (singleton pattern).
 */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default openai;
