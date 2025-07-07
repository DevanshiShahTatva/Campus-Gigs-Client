"use client";

import React, { useState } from "react";
import { FiSearch, FiMessageSquare } from "react-icons/fi";
import Image from "next/image";

interface ChatSidebarProps {
  onSelectChat: (chatId: string) => void;
  selectedChat: string | null;
}

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  isOnline: boolean;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ onSelectChat, selectedChat }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - replace with actual data from your API
  const [chats, setChats] = useState<Chat[]>([
    {
      id: "1",
      name: "John Doe",
      lastMessage: "Hey, how are you doing?",
      time: "2 min ago",
      unread: 2,
      avatar: "https://www.citypng.com/public/uploads/preview/hd-man-user-illustration-icon-transparent-png-701751694974843ybexneueic.png",
      isOnline: true,
    },
    {
      id: "2",
      name: "Jane Smith",
      lastMessage: "Can we schedule a meeting?",
      time: "1 hr ago",
      unread: 0,
      avatar: "https://www.citypng.com/public/uploads/preview/hd-man-user-illustration-icon-transparent-png-701751694974843ybexneueic.png",
      isOnline: false,
    },
    // Add more mock chats as needed
  ]);

  const filteredChats = chats.filter(
    (chat) => chat.name.toLowerCase().includes(searchQuery.toLowerCase()) || chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col w-full">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
        </div>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--base)] focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              className={`flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                selectedChat === chat.id ? "bg-gray-100" : ""
              }`}
              onClick={() => onSelectChat(chat.id)}
            >
              <div className="relative mr-3">
                <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
                  <Image src={chat.avatar} alt={chat.name} width={48} height={48} className="h-full w-full object-cover" />
                </div>
                {chat.isOnline && <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-900 truncate">{chat.name}</h3>
                  <span className="text-xs text-gray-500">{chat.time}</span>
                </div>
                <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
              </div>
              {chat.unread > 0 && <span className="ml-2 bg-[var(--base)] text-white text-xs font-medium px-2 py-1 rounded-full">{chat.unread}</span>}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500">
            <FiMessageSquare className="h-8 w-8 mb-2" />
            <p>No conversations found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
