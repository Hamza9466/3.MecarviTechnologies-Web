export type ChatTab = "friends" | "groups" | "contacts";
export type MessageType = "text" | "audio" | "image" | "file";

export interface SharedFile {
  id: number;
  name: string;
  type: string; // "pdf", "image", "video", etc.
  url: string;
  timestamp: string;
  fileSize?: string;
}

export interface SharedPhoto {
  id: number;
  url: string;
  timestamp: string;
}

export interface ChatContact {
  id: number;
  name: string;
  avatar?: string;
  avatarUrl?: string;
  lastMessage?: string;
  timestamp?: string;
  unreadCount?: number;
  onlineStatus?: boolean;
  email?: string;
  status?: string; // e.g., "Typing...", "online"
  sharedFiles?: SharedFile[];
  photos?: SharedPhoto[];
}

export interface ChatMessage {
  id: number;
  senderId: number;
  senderName: string;
  senderAvatar?: string;
  senderAvatarUrl?: string;
  content: string;
  timestamp: string;
  type: MessageType;
  isRead: boolean;
  audioUrl?: string;
  audioDuration?: string;
  fileUrl?: string;
  fileName?: string;
}

export interface ChatGroup {
  id: number;
  name: string;
  avatar?: string;
  avatarUrl?: string;
  members: string[];
  onlineCount: number;
  totalMembers: number;
  lastMessage?: string;
  timestamp?: string;
  unreadCount?: number;
  emoji?: string;
}

export interface ChatConversation {
  contactId: number;
  contact: ChatContact;
  messages: ChatMessage[];
  sharedFiles?: Array<{
    id: number;
    name: string;
    type: string;
    url: string;
    timestamp: string;
  }>;
  photos?: Array<{
    id: number;
    url: string;
    timestamp: string;
  }>;
}

export interface ChatsResponse {
  success: boolean;
  data: {
    contacts: ChatContact[];
    groups: ChatGroup[];
    conversations: Record<number, ChatConversation>;
  };
}
