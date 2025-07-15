"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { FiSearch, FiMessageSquare } from "react-icons/fi";
import { MdOutlineImage } from "react-icons/md";
import { FaRegFile } from "react-icons/fa6";
import Image from "next/image";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";

import { apiCall } from "@/utils/apiCall";
import { RootState } from "@/redux";
import { Chat, OnlineUser } from "@/utils/interface";
import { SOCKET_EVENTS } from "@/lib/utils";
import useDebounce from "@/hooks/useDebounce";

interface ChatSidebarProps {
  onSelectChat: (chat: Chat) => void;
  selectedChat: Chat | null;
  socket: any;
  onChatsLoaded?: (chats: Chat[]) => void;
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

const ChatSidebar: React.FC<ChatSidebarProps> = ({ onSelectChat, selectedChat, socket, onChatsLoaded }) => {
  const { user_id } = useSelector((state: RootState) => state.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
  const debouncedSearch = useDebounce(searchQuery, 400);

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
        chat.other_user_id === userId ? { ...chat, status, lastSeen } : chat
      )
    );
  }, []);

  const fetchChats = useCallback(async (pageToFetch = 1, search = "") => {
    if (pageToFetch === 1) setLoading(true);

    try {
      const response = await apiCall({
        endPoint: `/chats?page=${pageToFetch}${search ? `&search=${encodeURIComponent(search)}` : ""}`,
        method: "GET",
      });

      if (response?.success) {
        const mappedChats: Chat[] = (response.data || []).map((item: any) => ({
          id: item.id,
          name: item.other_user?.name || "Unknown",
          other_user_id: item.other_user?.id,
          last_message: item.last_message?.message || "",
          is_deleted: item.last_message?.is_deleted,
          time: item.last_message?.created_at,
          unread: item.unread_count || 0,
          avatar: item.other_user?.profile || "",
          status: "offline",
          attachments: item.last_message?.attachments || [],
        }));

        setChats((prev) => pageToFetch === 1 ? mappedChats : [...prev, ...mappedChats]);
        setHasMore(response.meta?.page < response.meta?.totalPages);
        setPage(pageToFetch);
        // Call onChatsLoaded after loading chats (only on first page)
        if (pageToFetch === 1 && onChatsLoaded) {
          onChatsLoaded(mappedChats);
        }
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
  }, [onChatsLoaded]);

  useEffect(() => {
    fetchChats(1, debouncedSearch);
  }, [debouncedSearch, fetchChats]);

  useEffect(() => {
    if (!socket || !socket.connected) return;

    const handleUserPresence = ({ userId, status, timestamp }: { userId: number; status: string; timestamp: string }) => {
      updateChatStatus(userId, status, timestamp);

      if (selectedChatRef.current?.other_user_id === userId) {
        onSelectChat({
          ...selectedChatRef.current!,
          status,
          last_seen: timestamp,
        });
      }

      setOnlineUsers((prev) =>
        status === "online"
          ? prev.includes(userId) ? prev : [...prev, userId]
          : prev.filter((id) => id !== userId)
      );
    };

    const handleOnlineUsersResponse = (data: { onlineUsers: OnlineUser[] }) => {
      const ids = data.onlineUsers.map((u) => u.user_id);
      setOnlineUsers(ids);

      setChats((prev) =>
        prev.map((chat) => {
          const found = data.onlineUsers.find((u) => u.user_id === chat.other_user_id);
          return found ? { ...chat, status: "online", last_seen: found.last_seen } : chat;
        })
      );
    };

    const handleLatestMessage = (data: any) => {
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === data.chat_id
            ? {
              ...chat,
              last_message: data.message,
              attachments: data.attachments,
              time: data.created_at,
              is_deleted: data.is_deleted,
              unread:
              data.is_deleted || data.sender_id === user_id
                ? chat.unread
                : selectedChat?.id === data.chat_id
                  ? 0
                  : (chat.unread ?? 0) + 1,
            }
            : chat
        )
      );
    };

    const requestOnlineUsers = () => {
      socket.emit(SOCKET_EVENTS.getOnlineUsers, handleOnlineUsersResponse);
    };

    socket.on(SOCKET_EVENTS.userPresence, handleUserPresence);
    socket.on(SOCKET_EVENTS.latestMessage, handleLatestMessage);

    const timeout = setTimeout(requestOnlineUsers, 500);

    return () => {
      clearTimeout(timeout);
      socket.off(SOCKET_EVENTS.userPresence, handleUserPresence);
      socket.off(SOCKET_EVENTS.latestMessage, handleLatestMessage);
    };
  }, [socket, selectedChat, user_id, onSelectChat, updateChatStatus]);

  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      setTimeout(() => {
        socket.emit(SOCKET_EVENTS.getOnlineUsers, (data: { onlineUsers: OnlineUser[] }) => {
          if (data?.onlineUsers) {
            const ids = data.onlineUsers.map((u) => u.user_id);
            setOnlineUsers(ids);
            setChats((prev) =>
              prev.map((chat) => {
                const match = data.onlineUsers.find((u) => u.user_id === chat.other_user_id);
                return match ? { ...chat, status: "online", last_seen: match.last_seen } : chat;
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

    socket.on(SOCKET_EVENTS.connect, handleConnect);
    socket.on(SOCKET_EVENTS.disconnect, handleDisconnect);

    if (socket.connected) handleConnect();

    return () => {
      socket.off(SOCKET_EVENTS.connect, handleConnect);
      socket.off(SOCKET_EVENTS.disconnect, handleDisconnect);
    };
  }, [socket]);

  const fetchMoreChats = () => {
    if (!loading && hasMore) fetchChats(page + 1, debouncedSearch);
  };

  const filteredChats = chats;

  console.log("filteredChats::", filteredChats, chatsRef, chats)

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
                  {onlineUsers.includes(chat.other_user_id) && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{chat.name}</h3>
                    <span className="text-xs text-gray-500">{formatTimeAgo(chat.time)}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {chat.is_deleted ? (
                      "Message deleted"
                    ) : Array.isArray(chat.attachments) && chat.attachments.length > 0 ? (
                      chat.attachments.every((att: any) => att.type === "image") && chat.attachments[0] ? (
                        <span className="flex items-center gap-1">
                          <MdOutlineImage className="inline-block h-6 w-6 text-gray-400 mr-1" />
                          Image{chat.attachments.length > 1 ? ` +${chat.attachments.length - 1}` : ""}
                        </span>
                      ) : chat.attachments[0] ? (
                        <span className="flex items-center gap-1">
                          <FaRegFile className="inline-block h-5 w-5 text-gray-400" />
                          File{chat.attachments.length > 1 ? ` +${chat.attachments.length - 1}` : ""}
                        </span>
                      ) : (
                        chat.last_message || "No messages yet"
                      )
                    ) : (
                      chat.last_message || "No messages yet"
                    )}
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
