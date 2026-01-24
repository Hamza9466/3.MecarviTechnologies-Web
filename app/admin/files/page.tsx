"use client";

import { useState } from "react";
import { useFiles } from "@/components/admin/files/useFiles";
import { FileItem } from "@/components/admin/files/types";
import Link from "next/link";
import FolderPasswordModal from "@/components/admin/files/FolderPasswordModal";

export default function FileManagerPage() {
  const [currentPath, setCurrentPath] = useState("/");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFolder, setSelectedFolder] = useState<FileItem | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const { files, loading, error, refetch } = useFiles(currentPath);

  const handleFolderClick = (folder: FileItem) => {
    if (folder.isPasswordProtected) {
      setSelectedFolder(folder);
      setShowPasswordModal(true);
    } else {
      setCurrentPath(folder.path);
    }
  };

  const handlePasswordSubmit = (password: string) => {
    // Verify password and navigate
    // For now, just navigate (backend will handle password verification)
    if (selectedFolder) {
      setCurrentPath(selectedFolder.path);
      setShowPasswordModal(false);
      setSelectedFolder(null);
    }
  };

  const handleBack = () => {
    if (currentPath !== "/") {
      const parentPath = currentPath.split("/").slice(0, -1).join("/") || "/";
      setCurrentPath(parentPath);
    }
  };

  const getFileIcon = (file: FileItem) => {
    if (file.type === "folder") {
      return (
        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      );
    }
    // File icon based on extension
    return (
      <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "-";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-gray-100 px-6 py-4 mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">File Manager</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-300 p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded ${viewMode === "grid" ? "bg-blue-100 text-blue-600" : "text-gray-600"}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded ${viewMode === "list" ? "bg-blue-100 text-blue-600" : "text-gray-600"}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          <Link
            href="/admin/files/upload"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Upload Files
          </Link>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="px-6 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={handleBack}
            disabled={currentPath === "/"}
            className="text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-gray-600">/</span>
          {currentPath.split("/").filter(Boolean).map((segment, index, arr) => (
            <span key={index} className="text-gray-600">
              {segment}
              {index < arr.length - 1 && <span className="mx-1">/</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
              <p className="text-gray-600">Loading files...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-yellow-700">{error}</p>
            <p className="text-sm text-yellow-600 mt-2">
              Note: Backend API is not available. Using mock data for frontend development.
            </p>
          </div>
        ) : files.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-600 mb-4">No files or folders found.</p>
            <Link
              href="/admin/files/upload"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Upload Files
            </Link>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {files.map((file) => (
              <div
                key={file.id}
                onClick={() => file.type === "folder" && handleFolderClick(file)}
                className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow ${
                  file.type === "folder" ? "hover:bg-blue-50" : ""
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  {file.isPasswordProtected && (
                    <svg className="w-4 h-4 text-yellow-500 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                  {getFileIcon(file)}
                  <p className="mt-2 text-sm font-medium text-gray-900 truncate w-full">{file.name}</p>
                  {file.type === "file" && (
                    <p className="text-xs text-gray-500 mt-1">{formatFileSize(file.size)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Modified
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {files.map((file) => (
                  <tr
                    key={file.id}
                    onClick={() => file.type === "folder" && handleFolderClick(file)}
                    className={`hover:bg-gray-50 ${file.type === "folder" ? "cursor-pointer" : ""}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {getFileIcon(file)}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{file.name}</div>
                          {file.isPasswordProtected && (
                            <span className="text-xs text-yellow-600">Password Protected</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 capitalize">{file.type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{formatFileSize(file.size)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {new Date(file.updatedAt).toLocaleDateString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showPasswordModal && selectedFolder && (
        <FolderPasswordModal
          folder={selectedFolder}
          onClose={() => {
            setShowPasswordModal(false);
            setSelectedFolder(null);
          }}
          onPasswordSubmit={handlePasswordSubmit}
        />
      )}
    </div>
  );
}

