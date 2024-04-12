import { createSlice } from '@reduxjs/toolkit';

type ConfigState = {
  appVersion: string,
};

export default createSlice({
  name: 'config',
  initialState: {} as ConfigState,
  reducers: {
    setAppVersion: (state, action) => ({...state, appVersion: action.payload }),
  },
});

