"use client";

import { ChatGroup } from "./types";

interface ChatGroupCardProps {
  group: ChatGroup;
  onClick: () => void;
}

export default function ChatGroupCard({ group, onClick }: ChatGroupCardProps) {
  const initials = group.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      onClick={onClick}
      className="px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100"
    >
      <div className="flex items-start gap-3">
        {/* Group Avatar */}
        <div className="relative flex-shrink-0">
          {group.avatarUrl ? (
            <img
              src={group.avatarUrl}
              alt={group.name}
              className="w-12 h-12 rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
                (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
              }}
            />
          ) : null}
          <div
            className={`w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-medium text-sm ${
              group.avatarUrl ? "hidden" : ""
            }`}
          >
            {initials}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {group.name} {group.emoji && <span>{group.emoji}</span>}
            </h3>
            {group.timestamp && (
              <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{group.timestamp}</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-green-600 font-medium">
                {group.onlineCount} Online
              </span>
              <span className="text-xs text-gray-500">
                +{group.totalMembers - group.onlineCount}
              </span>
            </div>
            {group.unreadCount && group.unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                {group.unreadCount}
              </span>
            )}
          </div>
          {group.lastMessage && (
            <p className="text-xs text-gray-600 truncate mt-1">{group.lastMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}
