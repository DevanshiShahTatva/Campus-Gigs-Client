import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useSelector } from "react-redux";

export function useSocket(userId: string | null) {
  const token = useSelector((state: any) => state.user?.token);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId || !token) return;

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

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      socket.emit("joinRoom", userId);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [userId, token]);

  return socketRef.current;
}
