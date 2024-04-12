import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type Channel = {
  id: string;
  name: string;
  users: string[];
  channelType: string;
  priv?: boolean;
  direct?: boolean;
};

export default createSlice({
  name: 'channels',
  initialState: {} as {[id: string]: Channel},
  reducers: {
    add: (state, action: PayloadAction<Channel | Channel[]>) => {
      const payload = action.payload;
      const newState = {...state};
      [payload as Channel | Channel[]].flat().forEach((channel) => {
        newState[channel.id] = Object.assign(newState[channel.id] || {}, channel);
      });
      return newState;
    },
    remove: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const newState = {...state};
      delete newState[id];
      return newState;
    },
  },
});

