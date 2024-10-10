import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

type InfoState = {
  type: string | null;
  message: string;
};

export default createSlice({
  name: 'info',
  initialState: { type: null, message: '' } as InfoState,
  reducers: {
    show: (_state, action: PayloadAction<InfoState>) => action.payload,
    reset: () => ({ type: null, message: '' }),
  },
});
