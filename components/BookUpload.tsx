"use client";

import { useState } from "react";

interface BookUploadProps {
  onUploadSuccess: (bookId: string, bookName: string, chunks: number) => void;
}

export default function BookUpload({ onUploadSuccess }: BookUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF file first.");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload-book", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      // Pass the bookId and chunks count to the parent component
      onUploadSuccess(data.bookId, data.bookName, data.totalChunks);
      setFile(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg mb-8">
      <h2 className="text-xl font-semibold text-white mb-4">Upload a Book</h2>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <label className="flex-1 w-full relative cursor-pointer">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />
          <div className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-600 rounded-lg hover:border-emerald-500 transition-colors bg-gray-900/50">
            <span className="text-gray-300 truncate">
              {file ? file.name : "Select a PDF file..."}
            </span>
          </div>
        </label>
        
        <button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className={`w-full sm:w-auto px-6 py-3 rounded-lg font-medium transition-all ${
            !file || isUploading
              ? "bg-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-emerald-600 text-white hover:bg-emerald-500 hover:shadow-md hover:shadow-emerald-500/20"
          }`}
        >
          {isUploading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>Indexing Locally...</span>
            </div>
          ) : (
            "Upload to DharmaAI"
          )}
        </button>
      </div>
      
      {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}
      
      {isUploading && (
        <p className="text-gray-400 mt-4 text-sm animate-pulse">
          Extracting text, chunking, and generating embeddings via Ollama. This might take a minute...
        </p>
      )}
    </div>
  );
}
