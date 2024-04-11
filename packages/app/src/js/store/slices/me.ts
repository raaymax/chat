import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type MeState = string | null;

const slice = createSlice({
  name: 'me',
  initialState: null as MeState,
  reducers: {
    set: (_state, action: PayloadAction<MeState>) => action.payload,
  },
});

export const methods = {};
export const { reducer, actions } = slice;
