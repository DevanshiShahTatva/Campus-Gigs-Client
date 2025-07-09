"use client";
import React, { useState, useEffect } from "react";
import { FiSearch, FiMessageSquare } from "react-icons/fi";
import Image from "next/image";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";

import { apiCall } from "@/utils/apiCall";
interface ChatSidebarProps {
  onSelectChat: (chatId: number, user: Chat) => void;
  selectedChat: number | null;
}

interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  isOnline: boolean;
}

// Utility to format ISO date to human-readable (e.g., '2 min ago')
function formatTimeAgo(dateString: string): string {
  if (!dateString) return '';
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hr ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
}

// Utility to get initials from full name
function getInitials(name: string): string {
  if (!name) return '';
  const words = name.trim().split(' ');
  if (words.length === 1) {
    return words[0][0].toUpperCase();
  }
  return (words[0][0] + (words[1][0] || '')).toUpperCase();
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ onSelectChat, selectedChat }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchChats(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchChats = async (pageToFetch = 1) => {
    if (pageToFetch === 1) setLoading(true);
    const response = await apiCall({
      endPoint: `/chats?page=${pageToFetch}`,
      method: "GET",
    });
    if (response?.success) {
      const mappedChats = (response.data || []).map((item: any) => {
        console.log(item, item.lastMessage?.message && item.lastMessage?.messageType === 'text' ? item.lastMessage?.message : '');
        return ({
          id: item.id,
          name: item.otherUser?.name,
          lastMessage: item.lastMessage?.message && item.lastMessage?.messageType === 'text' ? item.lastMessage?.message : '',
          time: formatTimeAgo(item.updatedAt),
          unread: item.unreadCount || 0,
          avatar: item.otherUser?.profile,
          isOnline: false,
        })
      });
      if (pageToFetch === 1) {
        setChats(mappedChats);
      } else {
        setChats((prev) => [...prev, ...mappedChats]);
      }
      setHasMore(response.meta && response.meta.page < response.meta.totalPages);
      setPage(pageToFetch);
    } else {
      toast.error(response.message);
      setHasMore(false);
    }
    if (pageToFetch === 1) setLoading(false);
  };

  const fetchMoreChats = () => {
    if (!loading && hasMore) {
      fetchChats(page + 1);
    }
  };

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
        {loading ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500">
            <svg className="animate-spin h-8 w-8 mb-2 text-[var(--base)]" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <p>Loading chats...</p>
          </div>
        ) : filteredChats.length > 0 ? (
          <>
            {/** InfiniteScroll for chat list */}
            <InfiniteScroll
              dataLength={filteredChats.length}
              next={fetchMoreChats}
              hasMore={hasMore}
              loader={<div className="text-center py-2 text-xs text-gray-400">Loading...</div>}
              scrollableTarget={null}
              style={{ overflow: 'unset' }}
            >
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => onSelectChat(chat.id, chat)}
                  className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${selectedChat === chat.id ? "bg-[var(--base)]/10" : "hover:bg-gray-100"
                    }`}
                >
                  <div className="relative">
                    {chat.avatar && chat.avatar !== '/default-avatar.png' ? (
                      <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
                        <Image src={chat.avatar} alt={chat.name} width={48} height={48} className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded-full flex items-center justify-center bg-[var(--base)] text-white text-lg font-bold border-2 border-[var(--base)]">
                        {getInitials(chat.name)}
                      </div>
                    )}
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
              ))}
            </InfiniteScroll>
          </>
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
