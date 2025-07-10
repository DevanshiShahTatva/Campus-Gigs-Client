"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { FiSend, FiPaperclip, FiSmile, FiChevronLeft, FiMessageSquare } from "react-icons/fi";
import dynamic from "next/dynamic";
import Image from "next/image";
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux';
import { toast } from "react-toastify";

import { apiCall } from "@/utils/apiCall";
import { Attachment, Chat, Message } from "@/utils/interface";

interface ChatWindowProps {
  selectedChat?: Chat | null;
  onBack?: () => void;
  socket?: any;
}

const MAX_ATTACHMENTS = 5;
const MESSAGE_PAGE_SIZE = 20;

// --- Utility Functions ---
const getDateLabel = (date: Date): string => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const messageDate = new Date(date);
  messageDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);

  if (messageDate.getTime() === today.getTime()) return "Today";
  if (messageDate.getTime() === yesterday.getTime()) return "Yesterday";
  if (messageDate.getTime() === tomorrow.getTime()) return "Tomorrow";
  return messageDate.toLocaleDateString();
};

const isDifferentDay = (date1: Date, date2: Date): boolean => {
  return date1.toDateString() !== date2.toDateString();
};

const getUserInitials = (name: string): string => {
  const parts = name.trim().split(' ');
  return parts.length === 1
    ? parts[0][0]?.toUpperCase() || ''
    : `${parts[0][0]?.toUpperCase() || ''}${parts[1][0]?.toUpperCase() || ''}`;
};

const DateSeparator: React.FC<{ date: Date }> = ({ date }) => (
  <div className="flex items-center justify-center my-4 sticky top-0">
    <div className="bg-gray-200 text-gray-800 font-medium text-xs px-3 py-1 rounded-full">
      {getDateLabel(date)}
    </div>
  </div>
);

const formatMessageData = (msg: any, currentUserId: number): Message => ({
  id: msg.id,
  text: msg.message,
  sender: msg.sender_id === currentUserId ? "me" : "them",
  time: new Date(msg.created_at || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  timestamp: new Date(msg.created_at || Date.now()),
  attachments: msg.attachments?.map((attachment: any) => ({
    id: attachment.id,
    name: attachment.filename,
    url: attachment.url,
    type: attachment.type,
    file_size: attachment.file_size,
    created_at: attachment.created_at,
    filename: attachment.filename,
    message_id: attachment.message_id,
    mimetype: attachment.mimetype,
  })) || [],
});

const EmojiPicker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const ChatWindow: React.FC<ChatWindowProps> = ({ selectedChat, onBack, socket }) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachments, setAttachments] = useState<Array<File | Attachment>>([]);
  const [attachmentPreviews, setAttachmentPreviews] = useState<Attachment[]>([]);
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const currentUserId = useSelector((state: RootState) => state.user.user_id);

  const scrollToBottom = useCallback((smooth: boolean = true) => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
    }
  }, []);

  const formatMessageData = useCallback((msg: any): Message => ({
    id: msg.id,
    text: msg.message,
    sender: msg.sender_id === currentUserId ? "me" : "them",
    time: new Date(msg.created_at || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    timestamp: new Date(msg.created_at || Date.now()),
    attachments: msg.attachments?.map((attachment: any) => ({
      id: attachment.id,
      name: attachment.filename,
      url: attachment.url,
      type: attachment.type,
      file_size: attachment.file_size,
      created_at: attachment.created_at,
      filename: attachment.filename,
      message_id: attachment.message_id,
      mimetype: attachment.mimetype,
    })) || [],
  }), [currentUserId]);

  const fetchMessages = useCallback(async (pageToFetch = 1) => {
    if (!selectedChat) return;

    setLoading(true);
    try {
      const response = await apiCall({
        endPoint: `/chats/${selectedChat.id}/messages?page=${pageToFetch}&limit=${MESSAGE_PAGE_SIZE}`,
        method: "GET",
      });

      if (response?.data) {
        const newMessages = response.data.reverse().map(formatMessageData);

        if (pageToFetch === 1) {
          setMessages(newMessages);
          setTimeout(() => scrollToBottom(false), 100);
        } else {
          setMessages((prev) => [...newMessages, ...prev]);
        }

        setHasMore(response.meta?.page < response.meta?.totalPages);
        setPage(pageToFetch);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [selectedChat, formatMessageData, scrollToBottom]);

  const handleNewMessage = useCallback((data: any) => {
    if (!data.message || data.message.chat_id !== selectedChat?.id) return;

    const newMessage = formatMessageData(data.message);

    setMessages((prev) => [...prev, newMessage]);

    if (data.message.sender_id === currentUserId) {
      setTimeout(() => scrollToBottom(), 100);
    } else {
      toast.success("New message received");
    }
  }, [selectedChat, currentUserId, formatMessageData, scrollToBottom]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setMessages([]);
    if (selectedChat) {
      if (socket && socket.connected) {
        socket.emit('markAsRead', { chatId: selectedChat.id });
      }
      fetchMessages(1);
    }
  }, [selectedChat, fetchMessages, socket]);

  useEffect(() => {
    if (socket && selectedChat) {
      socket.emit("joinChat", selectedChat.id);
      socket.on("newMessage", handleNewMessage);

      return () => {
        socket.off("newMessage", handleNewMessage);
      };
    }
  }, [socket, selectedChat, handleNewMessage]);

  const handleEmojiClick = (emojiData: any) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);

    // Check attachment limit
    if (attachments.length + newFiles.length > MAX_ATTACHMENTS) {
      toast.error(`You can only attach up to ${MAX_ATTACHMENTS} files`);
      return;
    }

    setAttachments((prev) => [...prev, ...newFiles]);

    const newPreviews: Attachment[] = newFiles.map((file) => ({
      id: `preview-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url: URL.createObjectURL(file),
      name: file.name || "file",
      type: file.type.startsWith("image/") ? "image" : "file",
      created_at: new Date().toISOString(),
      filename: file.name,
      message_id: 0,
      file_size: file.size,
      mimetype: file.type,
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
    if (!selectedChat) return;

    const formData = new FormData();
    formData.append("message", message.trim());
    attachments.slice(0, MAX_ATTACHMENTS).forEach((file) => {
      if (file instanceof File) {
        formData.append("files", file);
      }
    });

    setSending(true);
    try {
      const response = await apiCall({
        endPoint: `/chats/${selectedChat.id}/messages`,
        method: "POST",
        headers: { "Content-Type": "multipart/form-data" },
        body: formData,
        isFormData: true,
      });

      if (!response?.success) {
        throw new Error(response?.message || "Failed to send message");
      }

      setMessage("");
      setAttachments([]);
      setAttachmentPreviews([]);
    } catch (err: any) {
      toast.error(err.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const fetchMoreMessages = useCallback(() => {
    if (!loading && hasMore) {
      fetchMessages(page + 1);
    }
  }, [loading, hasMore, page, fetchMessages]);

  const renderMessage = (msg: Message) => (
    <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg px-4 py-2 ${msg.sender === "me"
        ? "bg-[var(--base)] text-white rounded-tr-none"
        : "bg-white text-gray-800 rounded-tl-none shadow-sm"
        }`}>
        {msg.text && <p className="text-sm mb-2">{msg.text}</p>}
        {msg.attachments && msg.attachments?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {msg.attachments.map((attachment, idx) => (
              <div key={attachment.id || idx} className="relative">
                {attachment.type === "image" ? (
                  <div className={`h-20 w-20 rounded-md overflow-hidden border relative ${msg.sender === "me" ? "border-white" : "border-gray-200"
                    }`}>
                    <Image
                      src={attachment.url}
                      alt={attachment.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className={`h-20 w-40 p-2 bg-white rounded-md border ${msg.sender === "me" ? "border-white" : "border-gray-200"
                    } flex items-center`}>
                    <div className="text-xs truncate">{attachment.name}</div>
                  </div>
                )}
                {attachment.file_size && (
                  <div className={`text-[10px] ${msg.sender === "me" ? "text-white" : "text-gray-500"
                    }`}>
                    {(attachment.file_size / 1024).toFixed(1)} KB
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
  );

  const renderMessagesWithDateSeparators = () => {
    const messageElements: React.ReactNode[] = [];

    messages.forEach((msg, index) => {
      const showDateSeparator = index === 0 ||
        isDifferentDay(msg.timestamp, messages[index - 1].timestamp);

      if (showDateSeparator) {
        messageElements.push(
          <DateSeparator key={`date-${msg.id}`} date={msg.timestamp} />
        );
      }

      messageElements.push(renderMessage(msg));
    });

    return messageElements;
  };

  if (!selectedChat) {
    return (
      <div className="hidden md:flex flex-col items-center justify-center h-full bg-gray-50 p-6 text-center">
        <div className="max-w-md">
          <div className="mx-auto h-24 w-24 bg-[var(--base)] bg-opacity-10 rounded-full flex items-center justify-center mb-6">
            <FiMessageSquare className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Select a conversation</h2>
          <p className="text-gray-600 mb-8">
            Choose an existing conversation or start a new one to begin messaging
          </p>
        </div>
      </div>
    );
  }

  const getUserInitials = (name: string) => {
    const parts = name.trim().split(' ');
    return parts.length === 1
      ? parts[0][0].toUpperCase()
      : (parts[0][0].toUpperCase() + (parts[1][0] || '').toUpperCase());
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          <button
            className="md:hidden mr-2 p-1 rounded-full hover:bg-gray-100"
            onClick={onBack}
            aria-label="Back to conversations"
          >
            <FiChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div className="relative mr-3">
            {selectedChat?.avatar && selectedChat.avatar !== '/default-avatar.png' ? (
              <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                <Image
                  src={selectedChat.avatar}
                  alt={selectedChat.name}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="h-10 w-10 rounded-full flex items-center justify-center bg-[var(--base)] text-white text-lg font-bold border-2 border-[var(--base)]">
                {getUserInitials(selectedChat?.name || '')}
              </div>
            )}
            {selectedChat?.status === "online" && (
              <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{selectedChat?.name || 'User'}</h3>
          </div>
        </div>
      </div>

      <div
        ref={chatContainerRef}
        className="flex-1 p-4 overflow-y-auto bg-gray-50 relative flex flex-col-reverse"
        id="scrollable-chat"
      >
        <InfiniteScroll
          dataLength={messages.length}
          next={fetchMoreMessages}
          hasMore={hasMore}
          style={{ display: 'flex', flexDirection: 'column-reverse' }}
          inverse={true}
          loader={<div className="text-center py-2 text-xs text-gray-400">Loading...</div>}
          scrollableTarget="scrollable-chat"
        >
          <div className="flex flex-col gap-3 relative">
            {renderMessagesWithDateSeparators()}
            <div ref={bottomRef} style={{ visibility: 'hidden', marginTop: "-11px" }} />
          </div>
        </InfiniteScroll>
      </div>

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
            className={`p-2 ${message.trim() || attachments.length > 0
              ? "text-[var(--base)]"
              : "text-gray-400"
              }`}
            aria-label="Send message"
          >
            <FiSend className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;