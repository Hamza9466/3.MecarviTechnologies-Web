export interface TeamMember {
  id: number;
  name: string;
  avatar: string | null;
  avatarUrl?: string | null;
}

export interface Meeting {
  date: string;
  startTime: string;
  endTime: string;
}

export type ProjectStatus = "green" | "orange" | "red";

export interface Project {
  id: number;
  name: string;
  client: string;
  description: string;
  status: ProjectStatus;
  statusDot: ProjectStatus;
  startDate: string;
  deadline: string;
  daysLeft: number;
  completionPercentage: number;
  allHours: string; // Format: "530 / 281:30"
  todayHours: string; // Format: "2:45"
  projectIcon: string | null;
  projectIconUrl?: string | null;
  teamMembers: TeamMember[];
  tasksCompleted: number;
  totalTasks: number;
  commentsCount: number;
  lastMeeting: Meeting | null;
  nextMeeting: Meeting | null;
  budget?: string;
  categories?: string;
  priorityStatus?: string;
  projectManager?: string;
  projectId?: string;
}

export interface ProjectsResponse {
  success: boolean;
  data: {
    projects: Project[];
  };
}

export interface CreateProjectFormData {
  projectName: string;
  projectId: string;
  client: string;
  startDate: string;
  endDate: string;
  description: string;
  projectPreviewImage: File | null;
  status: ProjectStatus;
  statusDot: ProjectStatus;
  allHours: string; // Format: "530 / 281:30"
  todayHours: string; // Format: "2:45"
  completionPercentage: number;
  tasksCompleted: number;
  totalTasks: number;
  commentsCount: number;
  lastMeetingDate: string;
  lastMeetingStartTime: string;
  lastMeetingEndTime: string;
  nextMeetingDate: string;
  nextMeetingStartTime: string;
  nextMeetingEndTime: string;
  budget: string;
  categories: string;
  teamMembers: string[]; // Array for multi-select
  priorityStatus: string;
  projectManager: string;
  attachedFiles: File[];
}
