"use client";

import { useState, useRef, useEffect } from "react";

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
  disabled?: boolean;
}

export default function VoiceRecorder({ onTranscription, disabled = false }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  const onTranscriptionRef = useRef(onTranscription);

  // Keep callback reference updated without triggering effect
  useEffect(() => {
    onTranscriptionRef.current = onTranscription;
  }, [onTranscription]);

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false; // stop automatically after a phrase
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscriptionRef.current(transcript);
    };

    recognition.onerror = (event: any) => {
      // Ignore abort errors that happen during manual stops/cleanups
      if (event.error === "aborted") return;
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, []);

  const toggleRecording = () => {
    if (!isSupported) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (e) {
        console.error("Failed to start speech recognition:", e);
      }
    }
  };

  if (!isSupported) {
    return (
      <button
        disabled
        className="p-3 rounded-full bg-gray-800 text-gray-500 cursor-not-allowed"
        title="Voice input not supported on this browser"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          <line x1="4" y1="4" x2="20" y2="20" strokeWidth="2" />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={toggleRecording}
      disabled={disabled}
      className={`p-3 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 ${
        isRecording
          ? "bg-red-500 hover:bg-red-600 focus:ring-red-500 animate-pulse"
          : disabled
            ? "bg-gray-700 text-gray-500 cursor-not-allowed"
            : "bg-gray-700 hover:bg-gray-600 text-white focus:ring-emerald-500"
      }`}
      title={isRecording ? "Stop Recording" : "Start Voice Input"}
    >
      {isRecording ? (
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm3 2a1 1 0 00-1 1v4a1 1 0 001 1h8a1 1 0 001-1V8a1 1 0 00-1-1H6z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      )}
    </button>
  );
}
