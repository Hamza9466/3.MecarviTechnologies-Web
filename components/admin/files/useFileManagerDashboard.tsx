import { useState, useEffect } from "react";
import { FileManagerDashboard, QuickAccessCategory, StorageCategory, FolderCard, RecentFile } from "./dashboardTypes";
import React from "react";

// Icon components
const ImagesIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const DocumentsIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const AudioIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
  </svg>
);

const AppsIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const VideoIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const MediaIcon = () => (
  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const DownloadsIcon = () => (
  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

// Folder icon component
const FolderIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);

// Mock data matching the design
const getMockDashboardData = (): FileManagerDashboard => {
  const quickAccess: QuickAccessCategory[] = [
    {
      name: "Images",
      icon: <ImagesIcon />,
      fileCount: 246,
      totalSize: "120.2GB",
      color: "purple",
    },
    {
      name: "Documents",
      icon: <DocumentsIcon />,
      fileCount: 150,
      totalSize: "45.8GB",
      color: "orange",
    },
    {
      name: "Audio",
      icon: <AudioIcon />,
      fileCount: 89,
      totalSize: "12.5GB",
      color: "green",
    },
    {
      name: "Apps",
      icon: <AppsIcon />,
      fileCount: 34,
      totalSize: "8.2GB",
      color: "yellow",
    },
    {
      name: "Video",
      icon: <VideoIcon />,
      fileCount: 67,
      totalSize: "95.3GB",
      color: "blue",
    },
  ];

  const storageCategories: StorageCategory[] = [
    {
      name: "Media",
      icon: <MediaIcon />,
      fileCount: 2872,
      size: "35GB",
      percentage: 30,
      color: "purple", // Lavender/purple as shown in design
    },
    {
      name: "Downloads",
      icon: <DownloadsIcon />,
      fileCount: 1200,
      size: "34GB",
      percentage: 29,
      color: "orange", // Orange/red as shown in design
    },
    {
      name: "Apps",
      icon: <AppsIcon />,
      fileCount: 34,
      size: "8GB",
      percentage: 7,
      color: "green", // Green as shown in design
    },
    {
      name: "Documents",
      icon: <DocumentsIcon />,
      fileCount: 150,
      size: "8GB",
      percentage: 7,
      color: "yellow", // Yellow/gold as shown in design
    },
  ];

  const folders: FolderCard[] = [
    {
      id: 1,
      name: "Images",
      fileCount: 345,
      icon: <FolderIcon />,
      color: "#3B82F6",
      users: [
        { id: 1, name: "User 1", initials: "U1" },
        { id: 2, name: "User 2", initials: "U2" },
        { id: 3, name: "User 3", initials: "U3" },
      ],
    },
    {
      id: 2,
      name: "Docs",
      fileCount: 45,
      icon: <FolderIcon />,
      color: "#3B82F6",
      users: [
        { id: 1, name: "User 1", initials: "U1" },
        { id: 2, name: "User 2", initials: "U2" },
        { id: 3, name: "User 3", initials: "U3" },
      ],
    },
    {
      id: 3,
      name: "Downloads",
      fileCount: 568,
      icon: <FolderIcon />,
      color: "#3B82F6",
      users: [
        { id: 1, name: "User 1", initials: "U1" },
        { id: 2, name: "User 2", initials: "U2" },
        { id: 3, name: "User 3", initials: "U3" },
      ],
    },
    {
      id: 4,
      name: "Apps",
      fileCount: 247,
      icon: <FolderIcon />,
      color: "#3B82F6",
      users: [
        { id: 1, name: "User 1", initials: "U1" },
        { id: 2, name: "User 2", initials: "U2" },
        { id: 3, name: "User 3", initials: "U3" },
      ],
    },
  ];

  const recentFiles: RecentFile[] = [
    {
      id: 1,
      name: "MEETING_NOTES_2024.docx",
      category: "Documents",
      size: "1.2MB",
      dateModified: "20 Mar 2024",
      fileType: "docx",
      iconColor: "purple",
    },
    {
      id: 2,
      name: "PROJECT_PLAN_MARCH_2024.pdf",
      category: "Reports",
      size: "2.3MB",
      dateModified: "05 Apr 2024",
      fileType: "pdf",
      iconColor: "orange",
    },
    {
      id: 3,
      name: "BUDGET_Q1_2024.xlsx",
      category: "Spreadsheets",
      size: "550KB",
      dateModified: "15 Mar 2024",
      fileType: "xlsx",
      iconColor: "green",
    },
    {
      id: 4,
      name: "PRODUCT_DEMO.mp4",
      category: "Videos",
      size: "1.5GB",
      dateModified: "10 Apr 2024",
      fileType: "mp4",
      iconColor: "blue",
    },
    {
      id: 5,
      name: "QUARTERLY_REPORT.pdf",
      category: "Reports",
      size: "3.1MB",
      dateModified: "01 Apr 2024",
      fileType: "pdf",
      iconColor: "orange",
    },
  ];

  return {
    quickAccess,
    storageUsage: {
      totalUsed: 85.5,
      categories: storageCategories,
    },
    folders,
    recentFiles,
  };
};

export function useFileManagerDashboard() {
  const [dashboard, setDashboard] = useState<FileManagerDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        // TODO: Replace with actual API call when backend is ready
        // const token = localStorage.getItem("token");
        // const response = await fetch("http://localhost:8000/api/v1/files/dashboard", {
        //   method: "GET",
        //   headers: {
        //     Accept: "application/json",
        //     ...(token && { Authorization: `Bearer ${token}` }),
        //   },
        // });
        // if (response.ok) {
        //   const data = await response.json();
        //   setDashboard(data);
        // } else {
        //   throw new Error("Failed to fetch dashboard data");
        // }

        // Using mock data for now
        const mockData = getMockDashboardData();
        setDashboard(mockData);
      } catch (err: any) {
        console.error("Error fetching dashboard:", err);
        setError(err.message || "Failed to fetch dashboard data");
        // Fallback to mock data
        const mockData = getMockDashboardData();
        setDashboard(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return {
    dashboard,
    loading,
    error,
    refetch: () => {
      const mockData = getMockDashboardData();
      setDashboard(mockData);
    },
  };
}
