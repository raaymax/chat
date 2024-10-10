import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Channel } from '../../types';

export default createSlice({
  name: 'channels',
  initialState: {} as {[id: string]: Channel},
  reducers: {
    add: (state, action: PayloadAction<Channel | Channel[]>) => {
      const { payload } = action;
      const newState = { ...state };
      [payload as Channel | Channel[]].flat().forEach((channel) => {
        newState[channel.id] = { ...newState[channel.id] || {}, ...channel };
      });
      return newState;
    },
    remove: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const newState = { ...state };
      delete newState[id];
      return newState;
    },
  },
});
