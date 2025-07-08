"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";

import ChatSidebar from "./components/ChatSidebar";
import ChatWindow from "./components/ChatWindow";
import { RootState } from "@/redux";
import { getSocket } from "@/utils/socket";

const MOBILE_BREAKPOINT = 768;

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}

export default function ChatPage() {
  const { token } = useSelector((state: RootState) => state.user);

  const [selectedChat, setSelectedChat] = useState<number>(0);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const isMobile = useIsMobile();

  const scrollRef = useRef<HTMLDivElement>(null);

  // Manage socket
  const socket = useMemo(() => (token ? getSocket("chat", token) : null), [token]);

  useEffect(() => {
    if (!socket) return;

    const onSocketRegistered = (message: any) => {
      console.log("Socket registered:", message);
    };

    socket.on("socketRegistered", onSocketRegistered);
    return () => {
      socket.off("socketRegistered", onSocketRegistered);
    };
  }, [socket]);

  useEffect(() => {
    scrollRef.current?.classList.add("overflow-hidden");
    return () => {
      scrollRef.current?.classList.remove("overflow-hidden");
    };
  }, []);

  const handleSelectChat = (chatId: number, user: any) => {
    setSelectedChat(chatId);
    setSelectedUser(user);
  };

  const showSidebar = !isMobile || (isMobile && !selectedChat);
  const showChatWindow = !isMobile || (isMobile && selectedChat !== 0);

  return (
    <div
      className="flex h-full bg-white rounded-lg border border-gray-200 overflow-hidden"
      ref={scrollRef}
    >
      {showSidebar && (
        <div className={`flex border-r w-full ${isMobile ? "w-full" : "max-w-[300px]"} border-gray-200`}>
          <ChatSidebar onSelectChat={handleSelectChat} selectedChat={selectedChat} />
        </div>
      )}
      {showChatWindow && (
        <div className="flex flex-col flex-1">
          <ChatWindow selectedChat={selectedChat} selectedUser={selectedUser} onBack={() => setSelectedChat(0)} socket={socket} />
        </div>
      )}
    </div>
  );
}
