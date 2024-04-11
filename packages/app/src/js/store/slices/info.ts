import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type InfoState = {
  type: string | null;
  message: string;
};

const slice = createSlice({
  name: 'info',
  initialState: { type: null, message: '' } as InfoState,
  reducers: {
    show: (_state, action: PayloadAction<InfoState>) => action.payload,
  },
});

export const methods = {};
export const { reducer, actions } = slice;
