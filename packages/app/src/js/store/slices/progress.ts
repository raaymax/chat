import { createSlice } from "@reduxjs/toolkit";

type ProgressState = {
  channelId: string;
  userId: string;
  parentId: string;
  count: number;
  lastMessageId: string;
};

export default createSlice({
  name: 'progress',
  initialState: [] as ProgressState[],
  reducers: {
    add: (state, action) => {
      const newState = [...state];
      [action.payload].flat().forEach((progress) => {
        const idx = newState.findIndex((item) => item.channelId === progress.channelId
          && item.userId === progress.userId && item.parentId === progress.parentId);
        if (idx !== -1) {
          newState[idx] = { ...newState[idx], ...progress };
          return newState;
        }
        newState.push(progress);
      });
      return newState;
    },
  },
});

