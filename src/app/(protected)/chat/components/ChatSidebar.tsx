"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { FiSearch, FiMessageSquare } from "react-icons/fi";
import Image from "next/image";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";

import { apiCall } from "@/utils/apiCall";

interface ChatSidebarProps {
  onSelectChat: (chat: Chat) => void;
  selectedChat: Chat | null;
  socket: any;
}

interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  otherUserId: number;
  time: string;
  unread: number;
  avatar: string;
  status: string;
  lastSeen?: string;
}

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

function getInitials(name: string): string {
  if (!name) return '';
  const words = name.trim().split(' ');
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + (words[1][0] || '')).toUpperCase();
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ onSelectChat, selectedChat, socket }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);

  // Refs to avoid stale closures in socket listeners
  const selectedChatRef = useRef<Chat | null>(selectedChat);
  const chatsRef = useRef<Chat[]>(chats);

  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    chatsRef.current = chats;
  }, [chats]);

  const fetchChats = useCallback(async (pageToFetch = 1) => {
    if (pageToFetch === 1) setLoading(true);
    try {
      const response = await apiCall({
        endPoint: `/chats?page=${pageToFetch}`,
        method: "GET",
      });

      if (response?.success) {
        const mappedChats = (response.data || []).map((item: any) => ({
          id: item.id,
          name: item.otherUser?.name,
          otherUserId: item.otherUser?.id,
          lastMessage: item.lastMessage?.messageType === 'text' ? item.lastMessage.message : '',
          time: formatTimeAgo(item.updatedAt),
          unread: item.unreadCount || 0,
          avatar: item.otherUser?.profile,
          status: "offline",
        }));

        setChats((prev) =>
          pageToFetch === 1 ? mappedChats : [...prev, ...mappedChats]
        );

        setHasMore(response.meta && response.meta.page < response.meta.totalPages);
        setPage(pageToFetch);
      } else {
        toast.error(response.message || "Failed to fetch chats");
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
      toast.error("Failed to fetch chats");
      setHasMore(false);
    }

    if (pageToFetch === 1) setLoading(false);
  }, []);

  useEffect(() => {
    fetchChats(1);
  }, [fetchChats]);

  useEffect(() => {
    if (!socket || !socket.connected) return;

    const handleUserPresence = (data: { userId: number; status: string; timestamp: string }) => {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.otherUserId === data.userId
            ? { ...chat, status: data.status, lastSeen: data.timestamp }
            : chat
        )
      );

      console.log("User presence updated:", data);

      const selected = chatsRef.current.find(
        (chat) => chat.otherUserId === selectedChatRef.current?.otherUserId
      );
      if (selected && selected.otherUserId === data.userId) {
        onSelectChat({
          ...selectedChatRef.current!,
          status: data.status,
          lastSeen: data.timestamp,
        });
      }

      setOnlineUsers((prevOnline) =>
        data.status === "online"
          ? prevOnline.includes(data.userId) ? prevOnline : [...prevOnline, data.userId]
          : prevOnline.filter((id) => id !== data.userId)
      );
    };

    const handleOnlineUsersResponse = (data: { onlineUsers: Array<{ userId: number; lastSeen?: string }> }) => {
      setOnlineUsers(data.onlineUsers.map((u) => u.userId));
      setChats((prev) =>
        prev.map((chat) => {
          const found = data.onlineUsers.find((u) => u.userId === chat.otherUserId);
          return found ? { ...chat, status: 'online', lastSeen: found.lastSeen } : chat;
        })
      );
    };

    socket.on("userPresence", handleUserPresence);

    const requestOnlineUsers = () => {
      if (socket.connected) {
        socket.emit("getOnlineUsers", handleOnlineUsersResponse);
      }
    };

    const timeout = setTimeout(requestOnlineUsers, 500);

    return () => {
      clearTimeout(timeout);
      socket.off("userPresence", handleUserPresence);
    };
  }, [socket, onSelectChat]);

  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      setTimeout(() => {
        if (socket.connected) {
          socket.emit("getOnlineUsers", (data: { onlineUsers: Array<{ userId: number; lastSeen?: string }> }) => {
            if (data?.onlineUsers) {
              setOnlineUsers(data.onlineUsers.map((u) => u.userId));
              setChats((prev) =>
                prev.map((chat) => {
                  const found = data.onlineUsers.find((u) => u.userId === chat.otherUserId);
                  return found ? { ...chat, status: 'online', lastSeen: found.lastSeen } : chat;
                })
              );
            }
          });
        }
      }, 100);
    };

    const handleDisconnect = () => {
      setOnlineUsers([]);
      setChats((prev) => prev.map((chat) => ({ ...chat, status: 'offline' })));
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [socket]);

  const fetchMoreChats = () => {
    if (!loading && hasMore) fetchChats(page + 1);
  };

  const filteredChats = chats.filter(
    (chat) =>
      chat.name &&
      (chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()))
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
                onClick={() => onSelectChat(chat)}
                className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${selectedChat?.id === chat.id ? "bg-[var(--base)]/10" : "hover:bg-gray-100"
                  }`}
              >
                <div className="relative">
                  {chat.avatar ? (
                    <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
                      <Image src={chat.avatar} alt={chat.name} width={48} height={48} className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="h-12 w-12 rounded-full flex items-center justify-center bg-[var(--base)] text-white text-lg font-bold border-2 border-[var(--base)]">
                      {getInitials(chat.name)}
                    </div>
                  )}
                  {onlineUsers.includes(chat.otherUserId) && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{chat.name || 'Unknown User'}</h3>
                    <span className="text-xs text-gray-500">{chat.time}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{chat.lastMessage || 'No messages yet'}</p>
                </div>
                {chat.unread > 0 && (
                  <span className="ml-2 bg-[var(--base)] text-white text-xs font-medium px-2 py-1 rounded-full">
                    {chat.unread}
                  </span>
                )}
              </div>
            ))}
          </InfiniteScroll>
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
