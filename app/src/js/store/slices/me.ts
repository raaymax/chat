import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

type MeState = string | null;

export default createSlice({
  name: 'me',
  initialState: null as MeState,
  reducers: {
    set: (_state, action: PayloadAction<MeState>) => action.payload,
  },
});
