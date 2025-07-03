import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  user: any | null;
  token: string | null;
  name?: string | null;
  profile?: string | null;
  user_id?: string | null;
}

const initialState: UserState = {
  user: null,
  token: null,
  name: null,
  profile: null,
  user_id: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<any>) {
      state.user = action.payload;
    },
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },
    setAuthData(state, action: PayloadAction<{ token: string; name: string; profile: string; user_id: string }>) {
      state.token = action.payload.token;
      state.name = action.payload.name;
      state.profile = action.payload.profile;
      state.user_id = action.payload.user_id;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.name = null;
      state.profile = null;
      state.user_id = null;
    },
  },
});

export const { setUser, setToken, setAuthData, logout } = userSlice.actions;
export default userSlice.reducer; 