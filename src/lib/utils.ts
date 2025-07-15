import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SOCKET_EVENTS = {
  messageUpdated: "messageUpdated",
  messageDeleted: "messageDeleted",
  joinChat: "joinChat",
  leaveChat: "leaveChat",
  getOnlineUsers: "getOnlineUsers",
  latestMessage: "latestMessage",
  userPresence: "userPresence",
  markAsRead: "markAsRead",
  newMessage: "newMessage",
  connect: "connect",
  disconnect: "disconnect",
};
