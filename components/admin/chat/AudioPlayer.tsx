"use client";

import { useState } from "react";

interface AudioPlayerProps {
  duration?: string;
  audioUrl?: string;
}

export default function AudioPlayer({ duration = "0:00 / 7:20", audioUrl }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [progress, setProgress] = useState(0);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In a real app, control audio playback here
  };

  // Parse duration to get current and total time
  const [currentTimeDisplay, totalTimeDisplay] = duration.split(" / ");

  return (
    <div className="flex items-center gap-3 py-2">
      {/* Play/Pause Button - Black triangular icon */}
      <button
        onClick={handlePlayPause}
        className="flex-shrink-0 text-gray-900 hover:text-gray-700 transition-colors"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
          </svg>
        )}
      </button>

      {/* Time Display */}
      <div className="text-sm text-gray-900 font-medium flex-shrink-0">
        <span>{currentTimeDisplay}</span>
        <span className="text-gray-600"> / </span>
        <span className="text-gray-600">{totalTimeDisplay}</span>
      </div>

      {/* Progress Bar */}
      <div className="flex-1 min-w-0">
        <div className="w-full bg-gray-300 rounded-full h-0.5">
          <div
            className="bg-gray-900 h-0.5 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Volume Control */}
      <button className="flex-shrink-0 text-gray-900 hover:text-gray-700 transition-colors" aria-label="Volume">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.383 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.383l4-3.707a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Options Menu */}
      <button className="flex-shrink-0 text-gray-900 hover:text-gray-700 transition-colors" aria-label="Options">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>
    </div>
  );
}
