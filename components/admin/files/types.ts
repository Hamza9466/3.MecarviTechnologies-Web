export interface FileItem {
  id: number;
  name: string;
  type: "file" | "folder";
  path: string;
  size?: number;
  mimeType?: string;
  isPasswordProtected?: boolean;
  createdAt: string;
  updatedAt: string;
  children?: FileItem[];
}

export interface Folder {
  id: number;
  name: string;
  path: string;
  isPasswordProtected: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FilesResponse {
  success: boolean;
  data: {
    files: FileItem[];
  };
}

