"use client";

import { useState, useEffect } from "react";
import { useChat } from "@/components/admin/chat/useChat";
import ChatSidebar from "@/components/admin/chat/ChatSidebar";
import ChatRightSidebar from "@/components/admin/chat/ChatRightSidebar";
import ChatHeader from "@/components/admin/chat/ChatHeader";
import MessageBubble, { DateSeparator } from "@/components/admin/chat/MessageBubble";
import MessageInput from "@/components/admin/chat/MessageInput";
import { ChatTab } from "@/components/admin/chat/types";

export default function ChatPage() {
  const { contacts, groups, messages, selectedContactId, loading, setSelectedContactId, fetchMessages, sendMessage } = useChat();
  const [activeTab, setActiveTab] = useState<ChatTab>("friends");
  const [currentMessages, setCurrentMessages] = useState<any[]>([]);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);

  const selectedContact = contacts.find((c) => c.id === selectedContactId);

  useEffect(() => {
    if (selectedContactId) {
      const loadMessages = async () => {
        const msgs = await fetchMessages(selectedContactId);
        setCurrentMessages(msgs);
      };
      loadMessages();
    } else {
      setCurrentMessages([]);
    }
  }, [selectedContactId]);

  useEffect(() => {
    if (selectedContactId && messages[selectedContactId]) {
      setCurrentMessages(messages[selectedContactId]);
    }
  }, [messages, selectedContactId]);

  const handleSendMessage = async (content: string) => {
    if (selectedContactId) {
      await sendMessage(selectedContactId, content);
      // Refresh messages from state
      const updatedMessages = messages[selectedContactId] || [];
      setCurrentMessages(updatedMessages);
    }
  };

  const handleContactSelect = (contactId: number) => {
    setSelectedContactId(contactId);
    setRightSidebarOpen(true); // Open right sidebar when contact is selected
  };

  const handleGroupSelect = (groupId: number) => {
    // Handle group selection
    console.log("Group selected:", groupId);
  };

  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-900">Chat</h1>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors">
            Plan Upgrade
          </button>
          <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
            Export Report
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <ChatSidebar
          activeTab={activeTab}
          contacts={contacts}
          groups={groups}
          selectedContactId={selectedContactId}
          onTabChange={setActiveTab}
          onContactSelect={handleContactSelect}
          onGroupSelect={handleGroupSelect}
        />

        {/* Chat Area */}
        <div className={`flex flex-col bg-[#F3F0FF] relative transition-all ${rightSidebarOpen && selectedContact ? 'flex-1' : 'flex-1'}`} style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23E0D5FF' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}>
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <p className="text-gray-600">Loading chats...</p>
              </div>
            </div>
          ) : selectedContact ? (
            <>
              {/* Chat Header */}
              <ChatHeader contact={selectedContact} />

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {/* Date Separator */}
                <DateSeparator date="Today - 23 Jan, 2025" />

                {/* Messages */}
                <div className="space-y-1">
                  {currentMessages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isOutgoing={message.senderId === 0}
                    />
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <MessageInput onSend={handleSendMessage} />
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a chat to start messaging</h3>
                <p className="text-gray-600">Choose a contact from the sidebar to begin your conversation</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        {selectedContact && (
          <ChatRightSidebar
            contact={selectedContact}
            isOpen={rightSidebarOpen}
            onClose={() => setRightSidebarOpen(false)}
            onPhoneCall={() => console.log("Phone call")}
            onVideoCall={() => console.log("Video call")}
            onChat={() => console.log("Chat")}
          />
        )}
      </div>
    </div>
  );
}
