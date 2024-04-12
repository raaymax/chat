import { createSlice } from "@reduxjs/toolkit";

type SystemState = {
  initFailed: boolean;
};

export default createSlice({
  name: 'system',
  initialState: { initFailed: false } as SystemState,
  reducers: {
    initFailed: (state, action) => ({ ...state, initFailed: action.payload }),
  },
});

