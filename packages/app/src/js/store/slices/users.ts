import { createSlice } from '@reduxjs/toolkit';
import { User } from '../../types';

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

