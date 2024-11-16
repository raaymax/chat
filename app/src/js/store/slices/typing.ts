import { createSlice } from '@reduxjs/toolkit';

type TypingState = {
  typings: { userId: string, channelId: string, parentId: string, timestamp: string }[]
  cooldown: boolean;
  queue: boolean;
};

export default createSlice({
  name: 'typing',
  initialState: { cooldown: false, queue: false, typings: [] } as TypingState,
  reducers: {
    add: (state, action) => {
      return {
        ...state,
        typings: [
          ...state.typings,
          {
            userId: action.payload.userId,
            channelId: action.payload.channelId,
            parentId: action.payload.parentId ?? null,
            timestamp: new Date().toISOString(),
          }
        ]
      };
    },
    clear: (state) => {
      return {
        ...state,
        cooldown: false,
        queue: false,
        typings: state.typings.filter(({ timestamp }) => new Date(timestamp) > new Date(Date.now() - 1000)),
      };
    },
    set: (state, action) => ({ ...state, ...action.payload }),
  },
});
