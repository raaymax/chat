import { createSlice } from '@reduxjs/toolkit';
import {createMethods} from '../tools';

type ConfigState = {
  appVersion: string,
};

const slice = createSlice({
  name: 'config',
  initialState: {} as ConfigState,
  reducers: {
    setAppVersion: (state, action) => ({...state, appVersion: action.payload }),
  },
});

export const methods = createMethods({
  module_name: 'config',
  methods: {
    load: async (_arg, {dispatch: { actions }}, { client }) => {
      const { data: [config] } = await client.req({ type: 'user:config' });
      actions.config.setAppVersion(config.appVersion);
      return config;
    },
  },
});

export const { reducer, actions } = slice;
