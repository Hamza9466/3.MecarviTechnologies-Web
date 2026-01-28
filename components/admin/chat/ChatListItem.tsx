"use client";

import { ChatContact } from "./types";

interface ChatListItemProps {
  contact: ChatContact;
  isActive?: boolean;
  onClick: () => void;
}

export default function ChatListItem({ contact, isActive = false, onClick }: ChatListItemProps) {
  const initials = contact.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      onClick={onClick}
      className={`px-4 py-3 cursor-pointer transition-colors ${
        isActive
          ? "bg-purple-50 border-l-4 border-purple-600"
          : "hover:bg-gray-50 border-l-4 border-transparent"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar with online status */}
        <div className="relative flex-shrink-0">
          {contact.avatarUrl ? (
            <img
              src={contact.avatarUrl}
              alt={contact.name}
              className="w-12 h-12 rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
                (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
              }}
            />
          ) : null}
          <div
            className={`w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-medium text-sm ${
              contact.avatarUrl ? "hidden" : ""
            }`}
          >
            {initials}
          </div>
          {contact.onlineStatus && (
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-gray-900 truncate">{contact.name}</h3>
            {contact.timestamp && (
              <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{contact.timestamp}</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-600 truncate flex-1">
              {contact.status || contact.lastMessage || "No messages yet"}
            </p>
            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
              {contact.unreadCount && contact.unreadCount > 0 ? (
                <span className="bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full min-w-[20px] text-center">
                  {contact.unreadCount}
                </span>
              ) : contact.lastMessage && !contact.unreadCount ? (
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
