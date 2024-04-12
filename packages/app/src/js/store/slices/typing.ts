import { createSlice } from "@reduxjs/toolkit";

type TypingState = {
  [channelId: string]: {
    [userId: string]: string;
  };
} & {
  cooldown: boolean;
  queue: boolean;
};

export default createSlice({
  name: 'typing',
  initialState: { cooldown: false, queue: false } as TypingState,
  reducers: {
    add: (state, action) => {
      const newState = {...state};
      [action.payload].flat().forEach(({userId, channelId}) => {
        newState[channelId] = newState[channelId] || {};
        newState[channelId][userId] = new Date().toISOString();
      });
      return newState;
    },
    clear: (state) => ({
      ...Object.fromEntries(
        Object.entries(state)
          .map(([channelId, users]) => [
            channelId,
            Object.fromEntries(
              Object.entries(users)
                .filter(([, date]) => new Date(date) > new Date(Date.now() - 1000)),
            ),
          ]),
      ) as {[channelId: string]: {[userId: string]: string}},
      cooldown: false,
      queue: false,
    } as TypingState),
    set: (state, action) => ({...state, ...action.payload}),
  },
});

