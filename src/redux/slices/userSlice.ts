import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  user: any | null;
  token: string | null;
  name?: string | null;
  profile?: string | null;
  user_id?: string | null;
  profile_type?: string | null;
}

const initialState: UserState = {
  user: null,
  token: null,
  name: null,
  profile: null,
  user_id: null,
  profile_type: null,
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
    setAuthData(state, action: PayloadAction<{ token: string; name: string; profile: string; user_id: string; profile_type: string }>) {
      state.token = action.payload.token;
      state.name = action.payload.name;
      state.profile = action.payload.profile;
      state.user_id = action.payload.user_id;
      state.profile_type = action.payload.profile_type;
    },
    setProfileType(state, action: PayloadAction<string>) {
      state.profile_type = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.name = null;
      state.profile = null;
      state.user_id = null;
      state.profile_type = null;
    },
  },
});

export const { setUser, setToken, setAuthData, setProfileType, logout } = userSlice.actions;
export default userSlice.reducer; 