"use client";

import { useState } from "react";
import { ChatTab, ChatContact, ChatGroup } from "./types";
import ChatListItem from "./ChatListItem";
import ChatGroupCard from "./ChatGroupCard";

interface ChatSidebarProps {
  activeTab: ChatTab;
  contacts: ChatContact[];
  groups: ChatGroup[];
  selectedContactId: number | null;
  onTabChange: (tab: ChatTab) => void;
  onContactSelect: (contactId: number) => void;
  onGroupSelect: (groupId: number) => void;
}

export default function ChatSidebar({
  activeTab,
  contacts,
  groups,
  selectedContactId,
  onTabChange,
  onContactSelect,
  onGroupSelect,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter contacts based on search
  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Separate active and all chats
  const activeChats = filteredContacts.filter((contact) => contact.onlineStatus || contact.unreadCount);
  const allChats = filteredContacts;

  // Filter groups based on search
  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-[25%] bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Tabs */}
      <div className="border-b border-gray-200 px-4 py-3">
        <div className="flex gap-1">
          <button
            onClick={() => onTabChange("friends")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "friends"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            FRIENDS
          </button>
          <button
            onClick={() => onTabChange("groups")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "groups"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            GROUPS
          </button>
          <button
            onClick={() => onTabChange("contacts")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "contacts"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            CONTACTS
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "friends" && (
          <>
            {/* Active Chats Section */}
            {activeChats.length > 0 && (
              <div className="px-4 py-3">
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">ACTIVE CHATS</h3>
                <div className="space-y-1">
                  {activeChats.map((contact) => (
                    <ChatListItem
                      key={contact.id}
                      contact={contact}
                      isActive={selectedContactId === contact.id}
                      onClick={() => onContactSelect(contact.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* All Chats Section */}
            <div className="px-4 py-3 border-t border-gray-100">
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">ALL CHATS</h3>
              <div className="space-y-1">
                {allChats.map((contact) => (
                  <ChatListItem
                    key={contact.id}
                    contact={contact}
                    isActive={selectedContactId === contact.id}
                    onClick={() => onContactSelect(contact.id)}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "groups" && (
          <>
            {/* My Chat Groups */}
            <div className="px-4 py-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">MY CHAT GROUPS</h3>
              <div className="space-y-2">
                {filteredGroups.map((group) => (
                  <div
                    key={group.id}
                    className="bg-gray-50 rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => onGroupSelect(group.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {group.avatarUrl ? (
                          <img
                            src={group.avatarUrl}
                            alt={group.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-medium">
                            {group.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </div>
                        )}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900">
                            {group.name} {group.emoji && <span>{group.emoji}</span>}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {group.onlineCount} Online
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">+{group.totalMembers - group.onlineCount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Group Chats */}
            <div className="px-4 py-3 border-t border-gray-100">
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">GROUP CHATS</h3>
              <div className="space-y-1">
                {filteredGroups.map((group) => (
                  <ChatGroupCard
                    key={group.id}
                    group={group}
                    onClick={() => onGroupSelect(group.id)}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "contacts" && (
          <div className="px-4 py-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">CONTACTS</h3>
            <div className="space-y-1">
              {filteredContacts.map((contact) => (
                <ChatListItem
                  key={contact.id}
                  contact={contact}
                  isActive={selectedContactId === contact.id}
                  onClick={() => onContactSelect(contact.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
