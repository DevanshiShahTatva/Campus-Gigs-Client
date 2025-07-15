import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Chat {
  id: number;
  name: string;
  other_user_id: number;
  last_message: string;
  is_deleted: boolean;
  time: string;
  unread: number;
  avatar: string;
  status?: string;
  last_seen?: string;
  attachments?: any[];
}

export interface ChatSidebarState {
  chats: Chat[];
  onlineUsers: number[];
}

const initialState: ChatSidebarState = {
  chats: [],
  onlineUsers: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChats(state, action: PayloadAction<Chat[]>) {
      state.chats = action.payload;
    },
    updateChat(state, action: PayloadAction<Chat>) {
      const idx = state.chats.findIndex(c => c.id === action.payload.id);
      if (idx !== -1) {
        state.chats[idx] = { ...state.chats[idx], ...action.payload };
      } else {
        state.chats.unshift(action.payload);
      }
    },
    setOnlineUsers(state, action: PayloadAction<number[]>) {
      state.onlineUsers = action.payload;
    },
    updateChatStatus(state, action: PayloadAction<{ userId: number; status: string; last_seen?: string }>) {
      state.chats = state.chats.map(chat =>
        chat.other_user_id === action.payload.userId
          ? { ...chat, status: action.payload.status, last_seen: action.payload.last_seen }
          : chat
      );
    },
    setChatDeleted(state, action: PayloadAction<{ chatId: number }>) {
      state.chats = state.chats.map(chat =>
        chat.id === action.payload.chatId ? { ...chat, is_deleted: true } : chat
      );
    },
    // Add more reducers as needed
  },
});

export const { setChats, updateChat, setOnlineUsers, updateChatStatus, setChatDeleted } = chatSlice.actions;
export default chatSlice.reducer;
