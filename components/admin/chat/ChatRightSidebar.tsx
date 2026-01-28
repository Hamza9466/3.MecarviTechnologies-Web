"use client";

import { ChatContact } from "./types";
import SharedFileItem from "./SharedFileItem";
import PhotoGrid from "./PhotoGrid";

interface ChatRightSidebarProps {
  contact: ChatContact | null;
  isOpen: boolean;
  onClose: () => void;
  onPhoneCall?: () => void;
  onVideoCall?: () => void;
  onChat?: () => void;
}

export default function ChatRightSidebar({
  contact,
  isOpen,
  onClose,
  onPhoneCall,
  onVideoCall,
  onChat,
}: ChatRightSidebarProps) {
  if (!isOpen || !contact) {
    return null;
  }

  const initials = contact.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const sharedFiles = contact.sharedFiles || [];
  const photos = contact.photos || [];

  const handleFileDownload = (file: any) => {
    console.log("Download file:", file);
    // Implement download logic
  };

  const handleViewAllFiles = () => {
    console.log("View all files");
    // Implement view all files logic
  };

  const handleViewAllPhotos = () => {
    console.log("View all photos");
    // Implement view all photos logic
  };

  return (
    <div className="w-[22%] bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Close Button */}
      <div className="px-4 py-3 border-b border-gray-200 flex justify-start">
        <button
          onClick={onClose}
          className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
          aria-label="Close sidebar"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* User Info Section */}
        <div className="px-4 py-6 text-center border-b border-gray-200">
          {/* Avatar */}
          <div className="relative inline-block mb-4">
            {contact.avatarUrl ? (
              <img
                src={contact.avatarUrl}
                alt={contact.name}
                className="w-20 h-20 rounded-full object-cover mx-auto"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                }}
              />
            ) : null}
            <div
              className={`w-20 h-20 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-xl mx-auto ${
                contact.avatarUrl ? "hidden" : ""
              }`}
            >
              {initials}
            </div>
            {contact.onlineStatus && (
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>

          {/* Name */}
          <h2 className="text-lg font-bold text-gray-900 mb-1">{contact.name}</h2>

          {/* Email */}
          {contact.email && (
            <p className="text-sm text-gray-500 mb-4">{contact.email}</p>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={onPhoneCall}
              className="w-12 h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center transition-colors"
              aria-label="Phone call"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </button>
            <button
              onClick={onVideoCall}
              className="w-12 h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center transition-colors"
              aria-label="Video call"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
            <button
              onClick={onChat}
              className="w-12 h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center transition-colors"
              aria-label="Chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Shared Files Section */}
        {sharedFiles.length > 0 && (
          <div className="px-4 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-900">Shared Files</h3>
                <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2 py-0.5 rounded-full">
                  {sharedFiles.length}
                </span>
              </div>
              <button
                onClick={handleViewAllFiles}
                className="text-purple-600 hover:text-purple-700 text-xs font-medium"
              >
                View All
              </button>
            </div>
            <div>
              {sharedFiles.map((file) => (
                <SharedFileItem key={file.id} file={file} onDownload={handleFileDownload} />
              ))}
            </div>
          </div>
        )}

        {/* Photos & Media Section */}
        {photos.length > 0 && (
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-900">Photos & Media</h3>
                <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2 py-0.5 rounded-full">
                  {photos.length}
                </span>
              </div>
              <button
                onClick={handleViewAllPhotos}
                className="text-purple-600 hover:text-purple-700 text-xs font-medium"
              >
                View All
              </button>
            </div>
            <PhotoGrid photos={photos} />
          </div>
        )}
      </div>
    </div>
  );
}
