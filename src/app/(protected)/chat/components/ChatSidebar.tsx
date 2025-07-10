"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { FiSearch, FiMessageSquare } from "react-icons/fi";
import Image from "next/image";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";

import { apiCall } from "@/utils/apiCall";
import { RootState } from "@/redux";

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
  isDeleted?: boolean;
}

interface OnlineUser {
  userId: number;
  lastSeen?: string;
}

const formatTimeAgo = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} min ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} hr ago`;
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;

  return date.toLocaleDateString();
};

const getInitials = (name: string): string => {
  const words = name.trim().split(" ");
  return (words[0][0] + (words[1]?.[0] || "")).toUpperCase();
};

const ChatSidebar: React.FC<ChatSidebarProps> = ({ onSelectChat, selectedChat, socket }) => {
  const { user_id } = useSelector((state: RootState) => state.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);

  const selectedChatRef = useRef(selectedChat);
  const chatsRef = useRef(chats);

  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    chatsRef.current = chats;
  }, [chats]);

  const updateChatStatus = useCallback((userId: number, status: string, lastSeen?: string) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.otherUserId === userId ? { ...chat, status, lastSeen } : chat
      )
    );
  }, []);

  const fetchChats = useCallback(async (pageToFetch = 1) => {
    if (pageToFetch === 1) setLoading(true);

    try {
      const response = await apiCall({
        endPoint: `/chats?page=${pageToFetch}`,
        method: "GET",
      });

      if (response?.success) {
        const mappedChats: Chat[] = (response.data || []).map((item: any) => ({
          id: item.id,
          name: item.otherUser?.name || "Unknown",
          otherUserId: item.otherUser?.id,
          lastMessage: item.lastMessage?.message || "",
          isDeleted: !!item.lastMessage?.deleted_at,
          time: item.lastMessage?.createdAt,
          unread: item.unreadCount || 0,
          avatar: item.otherUser?.profile || "",
          status: "offline",
        }));

        setChats((prev) => pageToFetch === 1 ? mappedChats : [...prev, ...mappedChats]);
        setHasMore(response.meta?.page < response.meta?.totalPages);
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

    const handleUserPresence = ({ userId, status, timestamp }: { userId: number; status: string; timestamp: string }) => {
      updateChatStatus(userId, status, timestamp);

      if (selectedChatRef.current?.otherUserId === userId) {
        onSelectChat({
          ...selectedChatRef.current!,
          status,
          lastSeen: timestamp,
        });
      }

      setOnlineUsers((prev) =>
        status === "online"
          ? prev.includes(userId) ? prev : [...prev, userId]
          : prev.filter((id) => id !== userId)
      );
    };

    const handleOnlineUsersResponse = (data: { onlineUsers: OnlineUser[] }) => {
      const ids = data.onlineUsers.map((u) => u.userId);
      setOnlineUsers(ids);

      setChats((prev) =>
        prev.map((chat) => {
          const found = data.onlineUsers.find((u) => u.userId === chat.otherUserId);
          return found ? { ...chat, status: "online", lastSeen: found.lastSeen } : chat;
        })
      );
    };

    const handleLatestMessage = (data: any) => {
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === data.chat_id
            ? {
              ...chat,
              lastMessage: data.message,
              time: data.created_at,
              unread: data.sender_id === user_id ? chat.unread : (chat.unread ?? 0) + 1,
            }
            : chat
        )
      );
    };

    const requestOnlineUsers = () => {
      socket.emit("getOnlineUsers", handleOnlineUsersResponse);
    };

    socket.on("userPresence", handleUserPresence);
    socket.on("latestMessage", handleLatestMessage);

    const timeout = setTimeout(requestOnlineUsers, 500);

    return () => {
      clearTimeout(timeout);
      socket.off("userPresence", handleUserPresence);
      socket.off("latestMessage", handleLatestMessage);
    };
  }, [socket, user_id, onSelectChat, updateChatStatus]);

  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      setTimeout(() => {
        socket.emit("getOnlineUsers", (data: { onlineUsers: OnlineUser[] }) => {
          if (data?.onlineUsers) {
            const ids = data.onlineUsers.map((u) => u.userId);
            setOnlineUsers(ids);
            setChats((prev) =>
              prev.map((chat) => {
                const match = data.onlineUsers.find((u) => u.userId === chat.otherUserId);
                return match ? { ...chat, status: "online", lastSeen: match.lastSeen } : chat;
              })
            );
          }
        });
      }, 100);
    };

    const handleDisconnect = () => {
      setOnlineUsers([]);
      setChats((prev) => prev.map((chat) => ({ ...chat, status: "offline" })));
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    if (socket.connected) handleConnect();

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
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col w-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Messages</h2>
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
            style={{ overflow: "unset" }}
          >
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat)}
                className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${selectedChat?.id === chat.id ? "bg-[var(--base)]/10" : "hover:bg-gray-100"}`}
              >
                <div className="relative">
                  {chat.avatar ? (
                    <Image src={chat.avatar} alt={chat.name} width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
                  ) : (
                    <div className="h-12 w-12 flex items-center justify-center rounded-full bg-[var(--base)] text-white text-lg font-bold border-2 border-[var(--base)]">
                      {getInitials(chat.name)}
                    </div>
                  )}
                  {onlineUsers.includes(chat.otherUserId) && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{chat.name}</h3>
                    <span className="text-xs text-gray-500">{formatTimeAgo(chat.time)}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {chat.isDeleted ? "Message deleted" : chat.lastMessage || "No messages yet"}
                  </p>
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
