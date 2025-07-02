import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  user: any | null;
  token: string | null;
}

const initialState: UserState = {
  user: null,
  token: null,
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
    logout(state) {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setUser, setToken, logout } = userSlice.actions;
export default userSlice.reducer; 