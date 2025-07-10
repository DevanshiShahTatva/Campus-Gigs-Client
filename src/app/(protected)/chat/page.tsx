"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";

import ChatSidebar from "./components/ChatSidebar";
import ChatWindow from "./components/ChatWindow";
import { RootState } from "@/redux";

const MOBILE_BREAKPOINT = 768;

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    handleResize(); // run once on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}

function useSocket(token?: string): {
  socket: Socket | null;
  isConnected: boolean;
  connectionError: string | null;
} {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isConnectingRef = useRef(false);

  const cleanup = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    setIsConnected(false);
    setConnectionError(null);
    isConnectingRef.current = false;
  }, []);

  const connectSocket = useCallback(() => {
    if (!token || isConnectingRef.current || socketRef.current?.connected) {
      return;
    }

    const wsUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/^https?/, "ws");
    if (!wsUrl) {
      console.warn("WebSocket URL not defined");
      setConnectionError("WebSocket URL not configured");
      return;
    }

    isConnectingRef.current = true;
    setConnectionError(null);

    try {
      // Clean up any existing socket first
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
      }

      const namespace = "chat";
      const socketUrl = `${wsUrl}${namespace}`;

      console.log("Connecting to WebSocket:", socketUrl);

      socketRef.current = io(socketUrl, {
        transports: ["websocket", "polling"],
        auth: { token },
        withCredentials: true,
        timeout: 10000,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        forceNew: true,
      });

      socketRef.current.on("connect", () => {
        console.log("WebSocket connected successfully");
        setIsConnected(true);
        setConnectionError(null);
        isConnectingRef.current = false;
      });

      socketRef.current.on("connect_error", (err) => {
        console.error("WebSocket connection error:", err.message);
        setConnectionError(err.message);
        setIsConnected(false);
        isConnectingRef.current = false;
      });

      socketRef.current.on("disconnect", (reason) => {
        console.log("WebSocket disconnected:", reason);
        setIsConnected(false);
        isConnectingRef.current = false;

        if (reason === "io client disconnect" || reason === "io server disconnect") {
          return;
        }
        if (token && !reconnectTimeoutRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log("Attempting to reconnect...");
            connectSocket();
          }, 2000);
        }
      });

      socketRef.current.on("reconnect", (attemptNumber) => {
        console.log("WebSocket reconnected after", attemptNumber, "attempts");
        setIsConnected(true);
        setConnectionError(null);
      });

      socketRef.current.on("reconnect_error", (err) => {
        console.error("WebSocket reconnection error:", err.message);
        setConnectionError(err.message);
      });

      socketRef.current.on("reconnect_failed", () => {
        console.error("WebSocket reconnection failed");
        setConnectionError("Failed to reconnect to server");
        setIsConnected(false);
      });

    } catch (error) {
      console.error("Error creating socket:", error);
      setConnectionError("Failed to create socket connection");
      isConnectingRef.current = false;
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      cleanup();
      return;
    }

    const connectTimeout = setTimeout(() => {
      connectSocket();
    }, 100);

    return () => {
      clearTimeout(connectTimeout);
      cleanup();
    };
  }, [token, connectSocket, cleanup]);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    socket: socketRef.current,
    isConnected,
    connectionError,
  };
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

export default function ChatPage() {
  const { token, user_id } = useSelector((state: RootState) => state.user);

  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  const isMobile = useIsMobile();
  const { socket, isConnected, connectionError } = useSocket(token!);

  useEffect(() => {
    const el = document.getElementById("scrollableDiv");
    if (el) el.classList.add("overflow-hidden");

    // Join user channel on mount
    if (socket && socket.connected && token) {
      if (user_id) {
        socket.emit('joinUserChannel', { userId: user_id });
      }
    }

    return () => {
      el?.classList.remove("overflow-hidden");
      // Leave user channel on unmount
      if (socket && socket.connected && token) {
        if (user_id) {
          socket.emit('leaveUserChannel', { userId: user_id });
        }
      }
    };
  }, [socket, token, user_id]);

  const handleSelectChat = (chat: Chat) => {
    console.log("Selected chat:", chat);
    setSelectedChat(chat);
  };

  const showSidebar = !isMobile || (isMobile && selectedChat === null);
  const showChatWindow = !isMobile || (isMobile && selectedChat !== null);

  return (
    <div className="flex h-full bg-white rounded-lg border border-gray-200 overflow-hidden">
      {connectionError && (
        <div className="absolute top-0 left-0 right-0 bg-red-500 text-white text-center py-2 text-sm z-50">
          Connection Error: {connectionError}
        </div>
      )}

      {!isConnected && !connectionError && (
        <div className="absolute top-0 left-0 right-0 bg-yellow-500 text-white text-center py-2 text-sm z-50">
          Connecting to chat server...
        </div>
      )}

      {showSidebar && (
        <div className={`flex border-r ${isMobile ? "w-full" : "max-w-[300px]"} border-gray-200`}>
          <ChatSidebar
            socket={socket}
            onSelectChat={handleSelectChat}
            selectedChat={selectedChat}
          />
        </div>
      )}
      {showChatWindow && (
        <div className="flex flex-col flex-1">
          <ChatWindow
            selectedChat={selectedChat}
            onBack={() => setSelectedChat(null)}
            socket={socket}
          />
        </div>
      )}
    </div>
  );
}