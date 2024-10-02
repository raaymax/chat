import { createSlice } from '@reduxjs/toolkit';
import { EmojiDescriptor } from '../../types';

type EmojiState = {
  ready: boolean;
  data: EmojiDescriptor[];
};

export default createSlice({
  name: 'emojis',
  initialState: { ready: false, data: [] } as EmojiState,
  reducers: {
    ready: (state) => ({ ...state, ready: true }),
    add: (state, action) => {
      const newState = { ...state, data: [...state.data] };
      [action.payload].flat().forEach((emoji) => {
        const idx = state.data.findIndex((e) => e.shortname === emoji.shortname);
        if (idx !== -1) {
          newState.data[idx] = { ...newState.data[idx], ...emoji };
          return newState;
        }
        newState.data.push(emoji);
      });
      return newState;
    },
  },
});
