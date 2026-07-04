"use client";

import { useState } from "react";
import BookUpload from "@/components/BookUpload";
import ChatWindow from "@/components/ChatWindow";

export default function Home() {
  const [bookId, setBookId] = useState<string | null>(null);
  const [bookName, setBookName] = useState<string | null>(null);
  const [chunksCount, setChunksCount] = useState<number>(0);

  const handleUploadSuccess = (id: string, name: string, chunks: number = 0) => {
    setBookId(id);
    setBookName(name);
    setChunksCount(chunks);
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white selection:bg-emerald-500/30">
      <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gray-800 rounded-2xl mb-6 shadow-xl border border-gray-700">
            <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Dharma<span className="text-emerald-500">AI</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            100% Local RAG Knowledge Assistant
          </p>
        </div>

        {/* Status Indicator (if book is uploaded) */}
        {bookName && (
          <div className="mb-8 flex flex-col items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              Currently reading: {bookName}
            </div>
            {chunksCount > 0 && (
              <span className="text-xs text-gray-500 bg-gray-900 px-3 py-1 rounded-full border border-gray-800">
                Indexed {chunksCount} chunks locally via Ollama
              </span>
            )}
          </div>
        )}

        {/* Main Content Area */}
        <div className="max-w-4xl mx-auto">
          {!bookId && (
            <div className="mb-8 transform transition-all duration-500 hover:scale-[1.01]">
              <BookUpload onUploadSuccess={(id, name) => handleUploadSuccess(id, name, 0)} />
            </div>
          )}

          <div className="relative">
            {/* Decorative background blur */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur opacity-20 transition duration-1000"></div>
            
            <div className="relative relative z-10">
              <ChatWindow bookId={bookId} />
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-gray-500">
          <p>DharmaAI MVP — Built with Next.js, Tailwind, and Ollama</p>
        </footer>
      </div>
    </main>
  );
}
