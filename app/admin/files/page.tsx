"use client";

import { useFileManagerDashboard } from "@/components/admin/files/useFileManagerDashboard";
import QuickAccessSection from "@/components/admin/files/QuickAccessSection";
import StorageUsageSection from "@/components/admin/files/StorageUsageSection";
import FoldersSection from "@/components/admin/files/FoldersSection";
import RecentFilesSection from "@/components/admin/files/RecentFilesSection";
import FileDropZone from "@/components/admin/files/FileDropZone";
import Link from "next/link";

export default function FileManagerPage() {
  const { dashboard, loading, error } = useFileManagerDashboard();

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-gray-100 px-6 py-4 mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">File Manager</h1>
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

      {/* Content */}
      <div className="px-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
              <p className="text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-yellow-700">{error}</p>
            <p className="text-sm text-yellow-600 mt-2">
              Note: Backend API is not available. Using mock data for frontend development.
            </p>
          </div>
        ) : dashboard ? (
          <div className="space-y-6">
            {/* Two-column layout: Quick Access (75%) and Storage Usage (25%) */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Quick Access Container - 75% width on desktop */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:w-[75%] space-y-6">
                {/* Quick Access Section */}
                <QuickAccessSection categories={dashboard.quickAccess} />

                {/* Folders Section */}
                {dashboard.folders && dashboard.folders.length > 0 && (
                  <>
                    <div className="border-t border-gray-200"></div>
                    <FoldersSection folders={dashboard.folders} />
                  </>
                )}

                {/* Recent Files Section */}
                {dashboard.recentFiles && dashboard.recentFiles.length > 0 && (
                  <>
                    <div className="border-t border-gray-200"></div>
                    <RecentFilesSection files={dashboard.recentFiles} />
                  </>
                )}
              </div>

              {/* Right Column - Storage Usage and File Drop Zone stacked */}
              <div className="flex flex-col gap-4 lg:w-[25%]">
                {/* Storage Usage Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <StorageUsageSection storageUsage={dashboard.storageUsage} />
                </div>

                {/* File Drop Zone Section - Same width as Storage Usage */}
                <FileDropZone />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-600">No dashboard data available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
