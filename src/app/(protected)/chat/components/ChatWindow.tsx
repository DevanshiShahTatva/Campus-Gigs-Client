"use client";
import React, { useState, useEffect, useRef } from "react";
import { FiSend, FiPaperclip, FiSmile, FiMoreVertical, FiChevronLeft, FiMessageSquare, FiDownload } from "react-icons/fi";
import dynamic from "next/dynamic";
import Image from "next/image";
import { apiCall } from "@/utils/apiCall";
import InfiniteScroll from 'react-infinite-scroll-component';

const EmojiPicker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

interface Attachment {
  id: string;
  name: string;
  url: string;
  type: "image" | "file";
  size?: number;
}

interface Message {
  id: string;
  text: string;
  sender: "me" | "them";
  time: string;
  status: "sent" | "delivered" | "read";
  timestamp: Date;
  attachments?: Attachment[];
}

interface ChatWindowProps {
  selectedChat?: number;
  selectedUser?: any;
  onBack?: () => void;
  socket?: any;
}

import { useSelector } from 'react-redux';
import type { RootState } from '@/redux';

const ChatWindow: React.FC<ChatWindowProps> = ({ selectedChat = 0, selectedUser, onBack, socket }) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachments, setAttachments] = useState<Array<File | Attachment>>([]);
  const [attachmentPreviews, setAttachmentPreviews] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const currentUserId = useSelector((state: RootState) => state.user.user_id);

  // Fetch messages for the selected chat and page
  const fetchMessages = async (pageToFetch = 1) => {
    if (!selectedChat) return;
    setLoading(true);
    try {
      const response = await apiCall({
        endPoint: `/chats/${selectedChat}/messages?page=${pageToFetch}`,
        method: "GET",
      });
      if (response?.data) {
        const newMessages = response.data.map((msg: any) => ({
          id: msg.id,
          text: msg.message,
          sender: msg.sender_id === currentUserId ? "me" : "them",
          time: new Date(msg.created_at || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          status: "sent",
          timestamp: new Date(msg.created_at || Date.now()),
          attachments: [],
        }));
        if (pageToFetch === 1) {
          setMessages(newMessages);
        } else {
          setMessages((prev) => [...newMessages, ...prev]);
        }
        setHasMore(response.meta && response.meta.page < response.meta.totalPages);
        setPage(pageToFetch);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setHasMore(false);
    }
    setLoading(false);
  };

  // On chat change, reset and fetch first page
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setMessages([]);
    if (selectedChat) fetchMessages(1);
  }, [selectedChat, selectedUser]);

  // Function to fetch next page (older messages)
  const fetchMoreMessages = () => {
    if (!loading && hasMore) {
      fetchMessages(page + 1);
    }
  };

  // Join chat room when selectedChat or socket changes
  useEffect(() => {
    if (socket && selectedChat) {
      socket.emit("joinChat", selectedChat);
    }
    return () => {
      if (socket) {
        socket.off("joinChat");
      }
    };
  }, [socket, selectedChat]);

  const getMessageDateInfo = (date: Date) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const messageDate = new Date(date);

    return {
      isToday: messageDate.toDateString() === today.toDateString(),
      isYesterday: messageDate.toDateString() === yesterday.toDateString(),
      formattedDate: messageDate.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    };
  };

  const groupMessagesByDate = (msgs: Message[]) => {
    const todayMessages: Message[] = [];
    const yesterdayMessages: Message[] = [];
    const otherMessages: { date: string; messages: Message[] }[] = [];
    const dateMap = new Map<string, Message[]>();

    msgs.forEach((msg) => {
      const { isToday, isYesterday, formattedDate } = getMessageDateInfo(msg.timestamp);

      if (isToday) {
        todayMessages.push(msg);
      } else if (isYesterday) {
        yesterdayMessages.push(msg);
      } else {
        if (!dateMap.has(formattedDate)) {
          dateMap.set(formattedDate, []);
        }
        dateMap.get(formattedDate)!.push(msg);
      }
    });

    dateMap.forEach((messages, date) => {
      otherMessages.push({ date, messages });
    });

    otherMessages.sort((a, b) => new Date(b.messages[0].timestamp).getTime() - new Date(a.messages[0].timestamp).getTime());

    const grouped: { date: string; messages: Message[]; isSticky?: boolean }[] = [];

    if (yesterdayMessages.length > 0) {
      grouped.push({ date: "Yesterday", messages: yesterdayMessages, isSticky: true });
    }

    if (todayMessages.length > 0) {
      grouped.push({ date: "Today", messages: todayMessages, isSticky: true });
    }

    grouped.push(...otherMessages);

    // Reverse the groups and their messages for bottom-up display
    return grouped.reverse().map(group => ({
      ...group,
      messages: group.messages.slice().reverse(),
    }));
  };

  const handleEmojiClick = (emojiData: any) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    setAttachments((prev) => [...prev, ...newFiles]);

    const newPreviews: Attachment[] = newFiles.map((file) => ({
      id: `preview-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url: URL.createObjectURL(file),
      name: file.name || "file",
      type: file.type.startsWith("image/") ? "image" : "file",
      size: file.size,
    }));

    setAttachmentPreviews((prev) => [...prev, ...newPreviews]);
    e.target.value = "";
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
    setAttachmentPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() === "" && attachments.length === 0) return;

    if (attachments.length === 0 && selectedChat && message.trim()) {
      try {
        const response = await apiCall({
          endPoint: `/chats/${selectedChat}/messages`,
          method: "POST",
          body: {
            message: message.trim(),
          },
        });
        if (response?.data) {
          setMessages((prev) => [
            ...prev,
            {
              id: response.data.id,
              text: response.data.message,
              sender: "me",
              time: new Date(response.data.createdAt || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              status: "sent",
              timestamp: new Date(response.data.createdAt || Date.now()),
              attachments: [],
            },
          ]);
        }
      } catch (err) {
        console.error("Send message failed", err);
      }
    }
    setMessage("");
    setAttachments([]);
    setAttachmentPreviews([]);
  };

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollToBottom = (force = false) => {
      const container = chatContainerRef.current;
      if (!container) return;
      // Only scroll if scrollbar is present and user is near the bottom or force is true
      const { scrollHeight, clientHeight, scrollTop } = container;
      const isScrolledToBottom = scrollHeight - clientHeight - scrollTop < 100;
      if (force || isScrolledToBottom) {
        container.scrollTop = container.scrollHeight;
      }
    };
    scrollToBottom();
    const timer = setTimeout(() => scrollToBottom(), 100);
    return () => clearTimeout(timer);
  }, [messages]);

  if (!selectedChat) {
    return (
      <div className="hidden md:flex flex-col items-center justify-center h-full bg-gray-50 p-6 text-center">
        <div className="max-w-md">
          <div className="mx-auto h-24 w-24 bg-[var(--base)] bg-opacity-10 rounded-full flex items-center justify-center mb-6">
            <FiMessageSquare className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Select a conversation</h2>
          <p className="text-gray-600 mb-8">Choose an existing conversation or start a new one to begin messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          <button className="md:hidden mr-2 p-1 rounded-full hover:bg-gray-100" onClick={onBack}>
            <FiChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div className="relative mr-3">
            {selectedUser?.avatar && selectedUser.avatar !== '/default-avatar.png' ? (
              <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                <Image
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="h-10 w-10 rounded-full flex items-center justify-center bg-[var(--base)] text-white text-lg font-bold border-2 border-[var(--base)]">
                {selectedUser?.name ? (selectedUser.name.trim().split(' ').length === 1 ? selectedUser.name[0].toUpperCase() : (selectedUser.name[0].toUpperCase() + (selectedUser.name.split(' ')[1][0] || '').toUpperCase())) : ''}
              </div>
            )}
            {selectedUser?.isOnline && <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{selectedUser?.name || 'User'}</h3>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto bg-gray-50" id="scrollable-chat">
        <InfiniteScroll
          dataLength={messages.length}
          next={fetchMoreMessages}
          hasMore={hasMore}
          inverse={true}
          loader={<div className="text-center py-2 text-xs text-gray-400">Loading...</div>}
          scrollableTarget="scrollable-chat"
          style={{ display: 'flex', flexDirection: 'column-reverse' }}
        >
          <div className="flex flex-col gap-3">
            {groupMessagesByDate(messages).map((group, idx) => (
              <div key={group.date + idx} className="flex flex-col gap-2">
                <div className={`flex items-center justify-center my-2 ${group.isSticky ? "sticky top-0 z-10 py-2" : ""}`}>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${group.isSticky ? "bg-white shadow-md text-[var(--base)]" : "text-[var(--base)]/60"
                      }`}
                  >
                    {group.date}
                  </span>
                </div>
                {group.messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg px-4 py-2 ${msg.sender === "me" ? "bg-[var(--base)] text-white rounded-tr-none" : "bg-white text-gray-800 rounded-tl-none shadow-sm"
                        }`}
                    >
                      {msg.text && <p className="text-sm mb-2">{msg.text}</p>}
                      {msg.attachments && msg.attachments?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {msg.attachments.map((attachment, idx) => (
                            <div key={attachment.id || idx} className="relative">
                              {attachment.type === "image" ? (
                                <div className="h-20 w-20 rounded-md overflow-hidden border border-gray-200">
                                  <Image src={attachment.url} alt={attachment.name} fill className="object-cover" />
                                </div>
                              ) : (
                                <div className="h-20 w-40 p-2 bg-white rounded-md border border-gray-200 flex items-center">
                                  <div className="text-xs truncate">{attachment.name}</div>
                                </div>
                              )}
                              {attachment.size && (
                                <div className={`text-[10px] ${msg.sender === "me" ? "text-[var(--base)]" : "text-gray-500"}`}>
                                  {(attachment.size / 1024).toFixed(1)} KB
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-end mt-1 space-x-1">
                        <span className="text-xs opacity-80">{msg.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </div>

      {/* Attachment Previews */}
      {attachmentPreviews.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-wrap gap-2">
            {attachmentPreviews.map((preview, index) => (
              <div key={index} className="relative group">
                {preview.type === "image" ? (
                  <div className="relative h-20 w-20 rounded-md overflow-hidden border border-gray-200">
                    <Image src={preview.url} alt="Preview" fill className="object-cover" />
                  </div>
                ) : (
                  <div className="h-20 w-40 p-2 bg-white rounded-md border border-gray-200 flex items-center">
                    <div className="text-xs truncate">{preview.name}</div>
                  </div>
                )}
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs hover:bg-red-600"
                  onClick={() => removeAttachment(index)}
                  aria-label="Remove attachment"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <form className="flex items-end gap-2" onSubmit={handleSendMessage}>
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-[var(--base)]"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Attach file"
          >
            <FiPaperclip className="h-5 w-5" />
          </button>
          <input
            type="file"
            multiple
            hidden
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.rar"
          />
          <div className="flex-1 relative">
            <input
              type="text"
              className="w-full border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:border-[var(--base)] text-sm"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onFocus={() => setShowEmojiPicker(false)}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-[var(--base)]"
              onClick={() => setShowEmojiPicker((v) => !v)}
              aria-label="Emoji picker"
            >
              <FiSmile className="h-5 w-5" />
            </button>
            {showEmojiPicker && (
              <div className="absolute bottom-12 right-0 z-20">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={message.trim() === "" && attachments.length === 0}
            className={`p-2 ${message.trim() || attachments.length > 0 ? "text-[var(--base)]" : "text-gray-400"}`}
          >
            <FiSend className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;