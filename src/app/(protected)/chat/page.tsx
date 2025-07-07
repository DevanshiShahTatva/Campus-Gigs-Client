"use client";

import React, { useState, useEffect } from "react";

import ChatSidebar from "./components/ChatSidebar";
import ChatWindow from "./components/ChatWindow";

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const el = document.getElementById("scrollableDiv");
    if (el) {
      el.classList.add("overflow-hidden");
    }
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      const el = document.getElementById("scrollableDiv");
      if (el) {
        el.classList.remove("overflow-hidden");
      }
    };
  }, []);

  

  const handleSelectChat = (chatId: string) => {
    setSelectedChat(chatId);
  };

  return (
    <div className="flex h-full bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div
        className={`${selectedChat && isMobile ? "hidden border-r-0" : "flex border-r"} w-full ${
          isMobile ? "w-full" : "max-w-[300px]"
        } border-gray-200`}
      >
        <ChatSidebar onSelectChat={handleSelectChat} selectedChat={selectedChat} />
      </div>
      <div className={`${!selectedChat && isMobile ? "hidden" : "flex"} flex-col flex-1`}>
        <ChatWindow selectedChat={selectedChat} onBack={() => setSelectedChat(null)} />
      </div>
    </div>
  );
}
