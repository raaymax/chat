import { createSlice } from '@reduxjs/toolkit';

type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
};

export default createSlice({
  name: 'users',
  initialState: {} as Record<string, User>,
  reducers: {
    add: (state, action) => {
      const newState = {...state};
      ([action.payload] as User[]).flat().forEach((user) => {
        newState[user.id] = Object.assign(newState[user.id] || {}, user);
      });
      return newState;
    },
  },
});

