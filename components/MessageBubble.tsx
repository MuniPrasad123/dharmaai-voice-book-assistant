"use client";

import { useState } from "react";
import { ChatMessage } from "@/lib/types";
import AudioPlayer from "./AudioPlayer";

interface MessageBubbleProps {
  message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const [showSources, setShowSources] = useState(false);

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] sm:max-w-[75%] flex flex-col gap-2 ${isUser ? "items-end" : "items-start"}`}>
        
        {/* Main Message Bubble */}
        <div
          className={`rounded-2xl px-5 py-4 shadow-sm ${
            isUser
              ? "bg-emerald-600 text-white rounded-br-sm"
              : "bg-gray-800 text-gray-100 border border-gray-700 rounded-bl-sm"
          }`}
        >
          <div className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">
            {message.content}
          </div>
          
          {!isUser && message.content && (
            <div className="mt-3 flex items-center justify-between border-t border-gray-700 pt-3">
              <AudioPlayer text={message.content} />
              
              {message.sources && message.sources.length > 0 && (
                <button
                  onClick={() => setShowSources(!showSources)}
                  className="text-xs font-medium px-3 py-1.5 rounded-md bg-gray-900/50 hover:bg-gray-700 text-gray-400 border border-gray-700 transition-colors flex items-center gap-1"
                >
                  <svg className={`w-4 h-4 transform transition-transform ${showSources ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  {showSources ? "Hide Sources" : "View Sources"}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Collapsible Sources Section */}
        {!isUser && message.sources && message.sources.length > 0 && showSources && (
          <div className="w-full mt-2 bg-gray-900/80 rounded-lg border border-gray-800 p-4 shadow-inner">
            <h4 className="text-xs font-semibold text-emerald-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Retrieved Context
            </h4>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {message.sources.map((source, idx) => (
                <div key={idx} className="bg-gray-800 rounded p-3 border border-gray-700 text-xs text-gray-300">
                  <span className="font-bold text-gray-500 mr-2">Snippet {idx + 1}:</span>
                  {source}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
