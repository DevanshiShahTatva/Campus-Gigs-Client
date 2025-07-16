import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useSelector } from "react-redux";

export function useSocket(userId: string | null) {
  const token = useSelector((state: any) => state.user?.token);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    // Use environment variable or fallback
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL! || "http://localhost:3001";

    const socket = io(baseUrl + "notification", {
      transports: ["websocket"],
      withCredentials: true,
      auth: {
        token,
      },
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [token]);

  // Always emit joinRoom when userId or socket changes and both are available
  useEffect(() => {
    const socket = socketRef.current;
    if (socket && userId && socket.connected) {
      socket.emit("joinRoom", userId);
    }
    // Also listen for connect event to re-emit joinRoom after reconnect
    if (socket && userId) {
      const handleConnect = () => {
        socket.emit("joinRoom", userId);
      };
      socket.on("connect", handleConnect);
      return () => {
        socket.off("connect", handleConnect);
      };
    }
  }, [userId, socketRef.current]);

  return socketRef.current;
}
