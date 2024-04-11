import { createSlice } from "@reduxjs/toolkit";

type SystemState = {
  initFailed: boolean;
};

const slice = createSlice({
  name: 'system',
  initialState: { initFailed: false } as SystemState,
  reducers: {
    initFailed: (state, action) => ({ ...state, initFailed: action.payload }),
  },
});

export const methods = {};
export const { actions, reducer } = slice;
