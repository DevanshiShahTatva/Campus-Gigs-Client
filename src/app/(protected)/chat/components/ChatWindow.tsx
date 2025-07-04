"use client";
import React, { useState, useEffect, useRef } from "react";
import { FiSend, FiPaperclip, FiSmile, FiMoreVertical, FiChevronLeft, FiMessageSquare, FiDownload } from "react-icons/fi";
import dynamic from "next/dynamic";
import Image from "next/image";

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
  selectedChat?: string | null;
  onBack?: () => void;
}

const messageData = [
  {
    id: "1",
    text: "Hey there! How are you doing?",
    sender: "me",
    time: "10:30 AM",
    status: "read",
    timestamp: new Date(),
    attachments: [
      {
        id: "att-1",
        name: "example-image.jpg",
        url: "https://picsum.photos/200/300",
        type: "image",
        size: 1024,
      },
    ],
  },
  {
    id: "2",
    text: "Hey there! How are you doing?",
    sender: "me",
    time: "10:30 AM",
    status: "read",
    timestamp: new Date(),
    attachments: [
      {
        id: "att-1",
        name: "example-image.jpg",
        url: "https://picsum.photos/200/300",
        type: "image",
        size: 1024,
      },
    ],
  },
  {
    id: "3",
    text: "Hey there! How are you doing?",
    sender: "me",
    time: "10:30 AM",
    status: "read",
    timestamp: new Date(),
    attachments: [
      {
        id: "att-1",
        name: "example-image.jpg",
        url: "https://picsum.photos/200/300",
        type: "image",
        size: 1024,
      },
    ],
  },
  {
    id: "2",
    text: "I'm good, thanks for asking! How about you?",
    sender: "them",
    time: "10:32 AM",
    status: "read",
    timestamp: new Date(Date.now() - 86400000), // Yesterday
    attachments: [
      {
        id: "att-2",
        name: "document.pdf",
        url: "#",
        type: "file",
        size: 2048,
      },
    ],
  },
] as Message[];

const ChatWindow: React.FC<ChatWindowProps> = ({ selectedChat = null, onBack }) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachments, setAttachments] = useState<Array<File | Attachment>>([]);
  const [attachmentPreviews, setAttachmentPreviews] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<Message[]>([...messageData].reverse());

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

    // Separate today's and yesterday's messages
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

    // Convert the map to array for other dates
    dateMap.forEach((messages, date) => {
      otherMessages.push({ date, messages });
    });

    // Sort other messages by date (newest first)
    otherMessages.sort((a, b) => new Date(b.messages[0].timestamp).getTime() - new Date(a.messages[0].timestamp).getTime());

    // Combine all groups with desired order: Yesterday > Today > Older
    const grouped: { date: string; messages: Message[]; isSticky?: boolean }[] = [];

    if (yesterdayMessages.length > 0) {
      grouped.push({ date: "Yesterday", messages: yesterdayMessages, isSticky: true });
    }

    if (todayMessages.length > 0) {
      grouped.push({ date: "Today", messages: todayMessages, isSticky: true });
    }

    // Add other dates (oldest at bottom)
    grouped.push(...otherMessages.reverse()); // Optional: reverse to keep oldest at bottom

    return grouped;
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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() === "" && attachments.length === 0) return;

    const messageAttachments: Attachment[] = attachments.map((item, index) => {
      if (item instanceof File) {
        return {
          id: `att-${Date.now()}-${index}`,
          name: item.name,
          url: URL.createObjectURL(item),
          type: item.type.startsWith("image/") ? "image" : "file",
          size: item.size,
        };
      } else {
        return {
          id: `att-${Date.now()}-${index}`,
          name: item.name || "file",
          url: item.url,
          type: item.type,
          size: item.size || 0,
        };
      }
    });

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
      timestamp: new Date(),
      attachments: messageAttachments,
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
    setAttachments([]);
    setAttachmentPreviews([]);
  };

  useEffect(() => {
    const scrollToBottom = () => {};
    scrollToBottom();
    const timer = setTimeout(scrollToBottom, 100);
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
            <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
              <Image
                src="https://www.citypng.com/public/uploads/preview/hd-man-user-illustration-icon-transparent-png-701751694974843ybexneueic.png"
                alt="User"
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">John Doe</h3>
            <p className="text-xs text-gray-500">Online</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        <div className="flex flex-col gap-3">
          {groupMessagesByDate(messages).map((group, idx) => (
            <div key={group.date + idx} className="flex flex-col gap-2">
              <div className={`flex items-center justify-center my-2 ${group.isSticky ? "sticky top-0 z-10 py-2" : ""}`}>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    group.isSticky ? "bg-white shadow-md text-[var(--base)]" : "text-[var(--base)]/60"
                  }`}
                >
                  {group.date}
                </span>
              </div>
              {group.messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg px-4 py-2 ${
                      msg.sender === "me" ? "bg-[var(--base)] text-white rounded-tr-none" : "bg-white text-gray-800 rounded-tl-none shadow-sm"
                    }`}
                  >
                    {msg.text && <p className="text-sm mb-2">{msg.text}</p>}

                    {msg.attachments && msg.attachments?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {msg.attachments.map((attachment, idx) => (
                          <div key={idx} className="relative">
                            {attachment.type === "image" ? (
                              <div className="w-32">
                                <div className="relative h-32 w-full rounded-md overflow-hidden border border-gray-200">
                                  <Image src={attachment.url} alt={attachment.name} fill className="object-cover" />
                                </div>
                                <div
                                  className={`mt-1 text-xs ${msg.sender === "me" ? "text-white" : "text-gray-600"} truncate`}
                                  title={attachment.name}
                                >
                                  {attachment.name}
                                </div>
                              </div>
                            ) : (
                              <div className="w-40">
                                <div
                                  className="h-16 p-2 bg-white rounded-md border border-gray-200 flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors"
                                  onClick={() => {
                                    const a = document.createElement("a");
                                    a.href = attachment.url;
                                    a.download = attachment.name;
                                    document.body.appendChild(a);
                                    a.click();
                                    document.body.removeChild(a);
                                  }}
                                >
                                  <FiDownload className={`flex-shrink-0 ${msg.sender === "me" ? "text-[var(--base)]" : "text-gray-500"}`} />
                                  <div className="flex-1 min-w-0">
                                    <div className={`text-xs font-medium truncate ${msg.sender === "me" ? "text-[var(--base)]" : "text-gray-600"}`}>
                                      {attachment.name || "File"}
                                    </div>
                                    {attachment.size && (
                                      <div className={`text-[10px] ${msg.sender === "me" ? "text-[var(--base)]" : "text-gray-500"}`}>
                                        {(attachment.size / 1024).toFixed(1)} KB
                                      </div>
                                    )}
                                  </div>
                                </div>
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
                  onClick={() => removeAttachment(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white relative">
        <form onSubmit={handleSendMessage} className="flex items-center">
          <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-500 hover:text-gray-700">
            <FiPaperclip className="h-5 w-5" />
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />
          <div className="relative">
            <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-2 text-gray-500 hover:text-gray-700">
              <FiSmile className="h-5 w-5" />
            </button>
            {showEmojiPicker && (
              <div className="fixed md:absolute bottom-16 right-4 md:right-0 md:bottom-full md:mb-2 z-50">
                <EmojiPicker onEmojiClick={handleEmojiClick} width={300} height={350} previewConfig={{ showPreview: false }} lazyLoadEmojis={true} />
              </div>
            )}
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-full px-4 py-2 mx-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--base)]"
          />
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
