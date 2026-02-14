import { useState, useEffect } from "react";
import { ChatContact, ChatGroup, ChatMessage, ChatConversation, ChatsResponse, SharedFile, SharedPhoto, type MessageType } from "./types";

// Mock data matching the design
const getMockContacts = (): ChatContact[] => {
  return [
    {
      id: 1,
      name: "Emma Johnson",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      lastMessage: "Hey there! How's your day going? 😊",
      timestamp: "1:32PM",
      unreadCount: 0,
      onlineStatus: true,
      email: "emma.johnson@example.com",
    },
    {
      id: 2,
      name: "Emiley Jackson",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emiley",
      lastMessage: "Typing...",
      timestamp: "12:24PM",
      unreadCount: 2,
      onlineStatus: true,
      status: "Typing...",
      email: "emaileyjackson2134@gmail.com",
      sharedFiles: [
        {
          id: 1,
          name: "Project Details.pdf",
          type: "pdf",
          url: "/files/project-details.pdf",
          timestamp: "24,Oct 2024 - 14:24PM",
        },
        {
          id: 2,
          name: "Img_02.Jpg",
          type: "image",
          url: "/files/img-02.jpg",
          timestamp: "22,Oct 2024 - 10:19AM",
        },
        {
          id: 3,
          name: "Img_15.Jpg",
          type: "image",
          url: "/files/img-15.jpg",
          timestamp: "22,Oct 2024 - 10:18AM",
        },
        {
          id: 4,
          name: "Video_15_02_2022.MP4",
          type: "video",
          url: "/files/video-15-02-2022.mp4",
          timestamp: "22,Oct 2024 - 10:18AM",
        },
      ],
      photos: Array.from({ length: 22 }, (_, i) => ({
        id: i + 1,
        url: `https://picsum.photos/seed/photo${i}/300/300`,
        timestamp: new Date(Date.now() - i * 86400000).toISOString(),
      })),
    },
    {
      id: 3,
      name: "Samuel Harris",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Samuel",
      lastMessage: "Just had the best coffee ever! ☕",
      timestamp: "1:16PM",
      unreadCount: 0,
      onlineStatus: false,
      email: "samuel.harris@example.com",
    },
    {
      id: 4,
      name: "Aria Robinson",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aria",
      lastMessage: "Guess what? I aced that test!",
      timestamp: "12:45PM",
      unreadCount: 0,
      onlineStatus: true,
      email: "aria.robinson@example.com",
      sharedFiles: [],
      photos: [],
    },
    {
      id: 5,
      name: "Lucas Hayes",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas",
      lastMessage: "Got any Netflix recommendations?",
      timestamp: "9:10AM",
      unreadCount: 0,
      onlineStatus: false,
      email: "lucas.hayes@example.com",
    },
    {
      id: 6,
      name: "Leo Phillips",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Leo",
      lastMessage: "Craving pizza right now! 🍕",
      timestamp: "10:22AM",
      unreadCount: 0,
      onlineStatus: false,
      email: "leo.phillips@example.com",
    },
    {
      id: 7,
      name: "Chloe Lewis",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chloe",
      lastMessage: "Weekend plans?",
      timestamp: "7:23AM",
      unreadCount: 0,
      onlineStatus: false,
      email: "chloe.lewis@example.com",
    },
    {
      id: 8,
      name: "Lily Brown",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lily",
      lastMessage: "Meet for lunch tomorrow?",
      timestamp: "8:31AM",
      unreadCount: 0,
      onlineStatus: false,
      email: "lily.brown@example.com",
    },
    {
      id: 9,
      name: "Evelyn Adams",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Evelyn",
      lastMessage: "Work is dragging...",
      timestamp: "9:45AM",
      unreadCount: 0,
      onlineStatus: false,
      email: "evelyn.adams@example.com",
    },
    {
      id: 10,
      name: "Logan Brooks",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Logan",
      lastMessage: "Movie night tonight? 🎬",
      timestamp: "11:54AM",
      unreadCount: 0,
      onlineStatus: false,
      email: "logan.brooks@example.com",
    },
  ];
};

const getMockGroups = (): ChatGroup[] => {
  return [
    {
      id: 1,
      name: "ChatMingle Collective",
      avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=CMC",
      members: ["Hira", "Emma", "Samuel", "Aria"],
      onlineCount: 4,
      totalMembers: 23,
      lastMessage: "Hira Typing...",
      timestamp: "12:24PM",
      unreadCount: 2,
      emoji: "😍",
    },
    {
      id: 2,
      name: "ConnectHub Crew",
      avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=CHC",
      members: ["Rams", "Emma", "Samuel"],
      onlineCount: 32,
      totalMembers: 155,
      lastMessage: "Rams: Happy to be part of this group",
      timestamp: "1:16PM",
      unreadCount: 0,
    },
    {
      id: 3,
      name: "TalkTide Tribe",
      avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=TTT",
      members: ["Simon", "Melissa", "Amanda"],
      onlineCount: 3,
      totalMembers: 18,
      lastMessage: "Simon,Melissa,Amanda,Patrick,Siddique",
      timestamp: "3 days ago",
      unreadCount: 0,
      emoji: "😎",
    },
    {
      id: 4,
      name: "DialogDynasty",
      avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=DD",
      members: ["Kamalan", "Subha", "Ambrose"],
      onlineCount: 5,
      totalMembers: 33,
      lastMessage: "Kamalan,Subha,Ambrose,Kiara,Jackson",
      timestamp: "5 days ago",
      unreadCount: 0,
    },
    {
      id: 5,
      name: "NexusChat Nexus",
      avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=NCN",
      members: ["Subman", "Rajen", "Kairo"],
      onlineCount: 0,
      totalMembers: 53,
      lastMessage: "Subman,Rajen,Kairo,Dibasha,Alexa",
      timestamp: "12 days ago",
      unreadCount: 0,
    },
  ];
};

const getMockMessages = (contactId: number): ChatMessage[] => {
  if (contactId === 4) {
    // Aria Robinson conversation
    return [
      {
        id: 1,
        senderId: 4,
        senderName: "Aria Robinson",
        senderAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aria",
        content: "Hey there! 😊 How's it going?",
        timestamp: "11:48PM",
        type: "text",
        isRead: true,
      },
      {
        id: 2,
        senderId: 4,
        senderName: "Aria Robinson",
        senderAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aria",
        content: "How is your day today? Is everything fine?",
        timestamp: "11:48PM",
        type: "text",
        isRead: true,
      },
      {
        id: 3,
        senderId: 0, // Current user
        senderName: "You",
        senderAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
        content: "Hey! I'm good, thanks. Just finished some work. How about you?",
        timestamp: "11:50PM",
        type: "text",
        isRead: true,
      },
      {
        id: 4,
        senderId: 4,
        senderName: "Aria Robinson",
        senderAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aria",
        content: "",
        timestamp: "11:51PM",
        type: "audio",
        isRead: true,
        audioUrl: "/audio/sample.mp3",
        audioDuration: "7:20",
      },
      {
        id: 5,
        senderId: 0,
        senderName: "You",
        senderAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
        content: "Not really, just relaxing. Maybe catch up on some movies. You?",
        timestamp: "11:52PM",
        type: "text",
        isRead: true,
      },
      {
        id: 6,
        senderId: 4,
        senderName: "Aria Robinson",
        senderAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aria",
        content: "Same here. Thinking of trying out that new cafe downtown. Heard they have amazing coffee.",
        timestamp: "11:55PM",
        type: "text",
        isRead: true,
      },
      {
        id: 7,
        senderId: 0,
        senderName: "You",
        senderAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
        content: "Oh, nice! Let me know how it is. I might check it out too.",
        timestamp: "11:58PM",
        type: "text",
        isRead: true,
      },
      {
        id: 8,
        senderId: 4,
        senderName: "Aria Robinson",
        senderAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aria",
        content: "No spoilers, promise! Enjoy the binge-watching session. 😄",
        timestamp: "12:01 PM",
        type: "text",
        isRead: true,
      },
    ];
  }
  return [];
};

export function useChat() {
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [groups, setGroups] = useState<ChatGroup[]>([]);
  const [selectedContactId, setSelectedContactId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Record<number, ChatMessage[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getToken = () => {
    return localStorage.getItem("token") || "";
  };

  const fetchChats = async () => {
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

      const response = await fetch("http://localhost:8000/api/v1/chats", {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.log("⚠️ Chats endpoint not available yet (404) - using mock data");
          const mockContacts = getMockContacts();
          const mockGroups = getMockGroups();
          setContacts(mockContacts);
          setGroups(mockGroups);
          setLoading(false);
          return;
        }
        throw new Error(`Failed to fetch chats: ${response.statusText}`);
      }

      const data: ChatsResponse = await response.json();

      if (data.success && data.data) {
        setContacts(data.data.contacts || []);
        setGroups(data.data.groups || []);
        if (data.data.conversations) {
          const messagesMap: Record<number, ChatMessage[]> = {};
          Object.keys(data.data.conversations).forEach((key) => {
            const contactId = parseInt(key);
            messagesMap[contactId] = data.data.conversations[contactId].messages || [];
          });
          setMessages(messagesMap);
        }
      } else {
        setContacts([]);
        setGroups([]);
      }
    } catch (err: any) {
      console.error("Error fetching chats:", err);
      if (err.message?.includes("Failed to fetch") || err.message?.includes("NetworkError")) {
        console.log("⚠️ Backend not available - using mock data for frontend development");
        const mockContacts = getMockContacts();
        const mockGroups = getMockGroups();
        setContacts(mockContacts);
        setGroups(mockGroups);
        setError("");
      } else {
        setError(err.message || "Failed to fetch chats");
        setContacts([]);
        setGroups([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (contactId: number) => {
    if (messages[contactId]) {
      return messages[contactId];
    }

    try {
      const token = getToken();
      const headers: HeadersInit = {
        Accept: "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`http://localhost:8000/api/v1/chats/${contactId}/messages`, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        if (response.status === 404) {
          const mockMessages = getMockMessages(contactId);
          setMessages((prev) => ({ ...prev, [contactId]: mockMessages }));
          return mockMessages;
        }
        throw new Error(`Failed to fetch messages: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success && data.data?.messages) {
        setMessages((prev) => ({ ...prev, [contactId]: data.data.messages }));
        return data.data.messages;
      }
    } catch (err: any) {
      console.error("Error fetching messages:", err);
      const mockMessages = getMockMessages(contactId);
      setMessages((prev) => ({ ...prev, [contactId]: mockMessages }));
      return mockMessages;
    }

    return [];
  };

  const sendMessage = async (contactId: number, content: string, type: MessageType = "text") => {
    const newMessage: ChatMessage = {
      id: Date.now(),
      senderId: 0,
      senderName: "You",
      senderAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
      content,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      type,
      isRead: false,
    };

    setMessages((prev) => ({
      ...prev,
      [contactId]: [...(prev[contactId] || []), newMessage],
    }));

    // Update contact's last message
    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === contactId
          ? { ...contact, lastMessage: content, timestamp: newMessage.timestamp }
          : contact
      )
    );

    // In a real app, send to API here
    try {
      const token = getToken();
      await fetch(`http://localhost:8000/api/v1/chats/${contactId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ content, type }),
      });
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return {
    contacts,
    groups,
    messages,
    selectedContactId,
    loading,
    error,
    setSelectedContactId,
    fetchMessages,
    sendMessage,
    refetch: fetchChats,
  };
}
