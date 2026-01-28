"use client";

import React from "react";
import { FolderCard } from "./dashboardTypes";
import Link from "next/link";

interface FoldersSectionProps {
  folders: FolderCard[];
}

export default function FoldersSection({ folders }: FoldersSectionProps) {
  if (!folders || folders.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Folders</h2>
        <Link
          href="/admin/files/folders"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
        >
          View All
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Folder Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {folders.map((folder) => (
          <div
            key={folder.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 cursor-pointer hover:shadow-md transition-shadow relative"
          >
            {/* Three-dot menu */}
            <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>

            {/* Folder Icon */}
            <div className="text-blue-600 mb-4">
              {folder.icon}
            </div>

            {/* Folder Name */}
            <h3 className="text-gray-900 font-semibold text-base mb-2">{folder.name}</h3>

            {/* File Count */}
            <p className="text-sm text-gray-600 mb-4">{folder.fileCount} Files</p>

            {/* User Avatars */}
            <div className="flex items-center justify-end -space-x-2">
              {folder.users.map((user, index) => (
                <div
                  key={user.id}
                  className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-700"
                  style={{ zIndex: folder.users.length - index }}
                >
                  {user.initials || user.name.charAt(0)}
                </div>
              ))}
              {/* Add user button */}
              <div className="w-8 h-8 rounded-full bg-purple-600 border-2 border-white flex items-center justify-center text-xs font-medium text-white cursor-pointer hover:bg-purple-700 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
