import { useState, useEffect } from "react";
import { FileItem, FilesResponse } from "./types";

// Mock data for frontend development
const getMockFiles = (path: string = "/"): FileItem[] => {
  if (path === "/") {
    return [
      {
        id: 1,
        name: "Documents",
        type: "folder",
        path: "/Documents",
        isPasswordProtected: false,
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z",
      },
      {
        id: 2,
        name: "Images",
        type: "folder",
        path: "/Images",
        isPasswordProtected: false,
        createdAt: "2024-01-16T09:00:00Z",
        updatedAt: "2024-01-16T09:00:00Z",
      },
      {
        id: 3,
        name: "Private",
        type: "folder",
        path: "/Private",
        isPasswordProtected: true,
        createdAt: "2024-01-17T11:00:00Z",
        updatedAt: "2024-01-17T11:00:00Z",
      },
      {
        id: 4,
        name: "Project_Proposal.pdf",
        type: "file",
        path: "/Project_Proposal.pdf",
        size: 245760,
        mimeType: "application/pdf",
        createdAt: "2024-01-18T10:00:00Z",
        updatedAt: "2024-01-18T10:00:00Z",
      },
      {
        id: 5,
        name: "Meeting_Notes.docx",
        type: "file",
        path: "/Meeting_Notes.docx",
        size: 15360,
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        createdAt: "2024-01-19T14:00:00Z",
        updatedAt: "2024-01-19T14:00:00Z",
      },
      {
        id: 6,
        name: "Budget_2024.xlsx",
        type: "file",
        path: "/Budget_2024.xlsx",
        size: 32768,
        mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        createdAt: "2024-01-20T08:00:00Z",
        updatedAt: "2024-01-20T08:00:00Z",
      },
    ];
  } else if (path === "/Documents") {
    return [
      {
        id: 7,
        name: "Report_Final.pdf",
        type: "file",
        path: "/Documents/Report_Final.pdf",
        size: 512000,
        mimeType: "application/pdf",
        createdAt: "2024-01-21T10:00:00Z",
        updatedAt: "2024-01-21T10:00:00Z",
      },
      {
        id: 8,
        name: "Draft",
        type: "folder",
        path: "/Documents/Draft",
        isPasswordProtected: false,
        createdAt: "2024-01-22T09:00:00Z",
        updatedAt: "2024-01-22T09:00:00Z",
      },
    ];
  } else if (path === "/Images") {
    return [
      {
        id: 9,
        name: "logo.png",
        type: "file",
        path: "/Images/logo.png",
        size: 102400,
        mimeType: "image/png",
        createdAt: "2024-01-23T11:00:00Z",
        updatedAt: "2024-01-23T11:00:00Z",
      },
      {
        id: 10,
        name: "banner.jpg",
        type: "file",
        path: "/Images/banner.jpg",
        size: 204800,
        mimeType: "image/jpeg",
        createdAt: "2024-01-24T12:00:00Z",
        updatedAt: "2024-01-24T12:00:00Z",
      },
    ];
  }
  return [];
};

export function useFiles(folderPath: string = "/") {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getToken = () => {
    return localStorage.getItem("token") || "";
  };

  const fetchFiles = async (path: string = folderPath) => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();
      const headers: HeadersInit = {
        Accept: "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`http://localhost:8000/api/v1/files?path=${encodeURIComponent(path)}`, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.log("⚠️ Files endpoint not available yet (404) - using mock data");
          const mockFiles = getMockFiles(path);
          setFiles(mockFiles);
          setLoading(false);
          return;
        }
        throw new Error(`Failed to fetch files: ${response.statusText}`);
      }

      const data: FilesResponse = await response.json();

      if (data.success && data.data?.files) {
        setFiles(data.data.files);
        console.log(`✅ Loaded ${data.data.files.length} files/folders`);
      } else {
        setFiles([]);
      }
    } catch (err: any) {
      console.error("Error fetching files:", err);
      // Handle network errors gracefully - use mock data for frontend development
      if (err.message?.includes("Failed to fetch") || err.message?.includes("NetworkError")) {
        console.log("⚠️ Backend not available - using mock data for frontend development");
        const mockFiles = getMockFiles(path);
        setFiles(mockFiles);
        setError(""); // Don't show error for network issues during frontend development
      } else {
        setError(err.message || "Failed to fetch files");
        setFiles([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles(folderPath);
  }, [folderPath]);

  return {
    files,
    loading,
    error,
    refetch: () => fetchFiles(folderPath),
  };
}

