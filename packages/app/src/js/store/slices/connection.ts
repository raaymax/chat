import { createSlice } from '@reduxjs/toolkit';

type ConnectionState = boolean;

export default createSlice({
  name: 'connection',
  initialState: false as ConnectionState,
  reducers: {
    connected: () => true,
    disconnected: () => false,
  },
});

