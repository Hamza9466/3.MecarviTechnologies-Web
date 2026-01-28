import { ReactNode } from "react";

export interface QuickAccessCategory {
  name: string;
  icon: ReactNode;
  fileCount: number;
  totalSize: string;
  color: "purple" | "orange" | "green" | "yellow" | "blue";
}

export interface StorageCategory {
  name: string;
  icon: ReactNode;
  fileCount: number;
  size: string;
  percentage: number;
  color: "orange" | "green" | "blue" | "purple" | "yellow";
}

export interface StorageUsage {
  totalUsed: number;
  categories: StorageCategory[];
}

export interface FolderCard {
  id: number;
  name: string;
  fileCount: number;
  icon: ReactNode;
  color: string;
  users: Array<{
    id: number;
    name: string;
    avatar?: string;
    initials?: string;
  }>;
}

export interface RecentFile {
  id: number;
  name: string;
  category: string;
  size: string;
  dateModified: string;
  fileType: string;
  iconColor: "purple" | "orange" | "green" | "blue";
}

export interface FileManagerDashboard {
  quickAccess: QuickAccessCategory[];
  storageUsage: StorageUsage;
  folders: FolderCard[];
  recentFiles: RecentFile[];
}
