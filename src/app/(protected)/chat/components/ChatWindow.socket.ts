import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

// You may want to replace this with your actual auth context/hook
import { RootState } from "@/redux";
import { getSocket, disconnectSocket } from "@/utils/socket";

export function useChatSocket(
  selectedChat: number,
  onNewMessage: (msg: any) => void
) {
  const { token } = useSelector((state: RootState) => state.user);

  const socketRef = useRef<any>(null);

  useEffect(() => {
    if (!token) return;
    const socket = getSocket("chat", token);
    socketRef.current = socket;

    // Join chat room
    if (selectedChat !== 0) {
      socket.emit("joinChat", selectedChat);
    }

    // Listen for new messages
    socket.on("newMessage", onNewMessage);

    // Optionally: Listen for typing, presence, etc.

    return () => {
      socket.off("newMessage", onNewMessage);
      disconnectSocket();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, selectedChat]);

  // Send message
  const sendMessage = (msg: string) => {
    if (!socketRef.current || !selectedChat) return;
    socketRef.current.emit("sendMessage", {
      chatId: selectedChat,
      message: msg,
      type: "TEXT",
    });
  };

  return { sendMessage };
}
