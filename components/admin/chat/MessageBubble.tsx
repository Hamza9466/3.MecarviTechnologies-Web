"use client";

import { ChatMessage } from "./types";
import AudioPlayer from "./AudioPlayer";

interface MessageBubbleProps {
  message: ChatMessage;
  isOutgoing: boolean;
}

export default function MessageBubble({ message, isOutgoing }: MessageBubbleProps) {
  const initials = message.senderName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (isOutgoing) {
    return (
      <div className="flex items-start gap-2 justify-end mb-4">
        <div className="flex flex-col items-end max-w-[70%]">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-500">{message.timestamp}</span>
            <span className="text-xs text-gray-500 font-medium">You</span>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg px-4 py-2 shadow-sm">
            {message.type === "text" && <p className="text-sm">{message.content}</p>}
            {message.type === "audio" && (
              <AudioPlayer duration={message.audioDuration} audioUrl={message.audioUrl} />
            )}
          </div>
          {message.isRead && (
            <div className="flex items-center gap-1 mt-1">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>
        <div className="flex-shrink-0">
          {message.senderAvatarUrl ? (
            <img
              src={message.senderAvatarUrl}
              alt={message.senderName}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-medium">
              {initials}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2 mb-4">
      <div className="flex-shrink-0">
        {message.senderAvatarUrl ? (
          <img
            src={message.senderAvatarUrl}
            alt={message.senderName}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-medium">
            {initials}
          </div>
        )}
      </div>
      <div className="flex flex-col max-w-[70%]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-gray-900">{message.senderName}</span>
          <span className="text-xs text-gray-500">{message.timestamp}</span>
        </div>
        <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
          {message.type === "text" && <p className="text-sm text-gray-900">{message.content}</p>}
          {message.type === "audio" && (
            <AudioPlayer duration={message.audioDuration} audioUrl={message.audioUrl} />
          )}
        </div>
      </div>
    </div>
  );
}

interface DateSeparatorProps {
  date: string;
}

export function DateSeparator({ date }: DateSeparatorProps) {
  return (
    <div className="flex items-center justify-center my-4">
      <span className="bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1 rounded-full">
        {date}
      </span>
    </div>
  );
}
