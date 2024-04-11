import { createSlice } from '@reduxjs/toolkit';

type ConnectionState = boolean;

const slice = createSlice({
  name: 'connection',
  initialState: false as ConnectionState,
  reducers: {
    connected: () => true,
    disconnected: () => false,
  },
});

export const methods = {};
export const { reducer, actions } = slice;
