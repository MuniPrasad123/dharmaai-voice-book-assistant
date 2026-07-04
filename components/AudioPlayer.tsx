"use client";

import { useState, useRef, useEffect } from "react";

interface AudioPlayerProps {
  text: string;
}

export default function AudioPlayer({ text }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && !window.speechSynthesis) {
      setIsSupported(false);
    }
    
    // Cleanup on unmount
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePlay = () => {
    if (!isSupported) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    // If currently speaking, stop it
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    // Initialize utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Optional: Try to find a good English voice
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith("en-") && v.name.includes("Google")) || voices.find(v => v.lang.startsWith("en-"));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }
    
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = (e) => {
      console.error("Speech synthesis error:", e);
      setIsPlaying(false);
    };

    utteranceRef.current = utterance;
    
    // Start speaking
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  if (!isSupported) return null;

  return (
    <button
      onClick={handlePlay}
      title="Play Audio"
      className="mt-3 text-xs font-medium px-3 py-1.5 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600 transition-colors flex items-center gap-2"
    >
      {isPlaying ? (
        <>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
          </svg>
          Stop Audio
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          Play Audio
        </>
      )}
    </button>
  );
}
