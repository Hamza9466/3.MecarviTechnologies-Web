export type TaskStatus = "todo" | "in_progress" | "review" | "done";

export interface SubTask {
  id: number;
  title: string;
  completed: boolean;
  notes?: string;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  avatar?: string;
  avatarUrl?: string;
}

export interface TaskDiscussion {
  id: number;
  content: string;
  userId: number;
  userName?: string;
  userAvatar?: string;
  createdAt: string;
}

export interface TaskActivity {
  id: number;
  type: "meeting" | "file" | "update" | "comment";
  title: string;
  description?: string;
  userId?: number;
  userName?: string;
  userAvatar?: string;
  files?: { name: string; icon: string; count?: string }[];
  teamMembers?: TeamMember[];
  createdAt: string;
}

export interface Task {
  id: number;
  taskId?: string; // e.g., "SPK - 123"
  title: string;
  description: string;
  status: TaskStatus;
  priority: "low" | "medium" | "high" | "urgent";
  dueDate: string | null;
  startDate?: string | null;
  projectId: number | null;
  projectName?: string;
  projectStatus?: string;
  assignedTo: number | null;
  assignedToName?: string;
  assignedToAvatar?: string;
  assignedTeam?: TeamMember[]; // Multiple team members
  projectManager?: {
    id: number;
    name: string;
    avatar?: string;
  };
  createdBy: number;
  createdByName?: string;
  createdAt: string;
  updatedAt: string;
  lastUpdated?: string; // e.g., "1 Day Ago"
  progress?: number; // 0-100
  subtasks?: SubTask[];
  attachments?: TaskAttachment[];
  documents?: TaskDocument[];
  comments?: TaskComment[];
  discussions?: TaskDiscussion[];
  activities?: TaskActivity[];
  tags?: string[];
  skills?: string[];
}

export interface TaskDocument {
  id: number;
  fileName: string;
  fileSize: number;
  fileType: string;
  iconColor?: string;
  uploadedAt: string;
}

export interface TaskAttachment {
  id: number;
  fileName: string;
  filePath: string;
  fileSize: number;
  uploadedAt: string;
}

export interface TaskComment {
  id: number;
  content: string;
  userId: number;
  userName?: string;
  userAvatar?: string;
  createdAt: string;
}

export interface CreateTaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  priority: "low" | "medium" | "high" | "urgent";
  dueDate: string;
  projectId: string;
  assignedTo: string;
  tags: string[];
}

export interface TasksResponse {
  success: boolean;
  data: {
    tasks: Task[];
  };
}

