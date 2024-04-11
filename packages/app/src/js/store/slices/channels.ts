import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { createMethods } from '../tools';

type Channel = {
  id: string;
  name: string;
  users: string[];
  priv?: boolean;
};

const slice = createSlice({
  name: 'channels',
  initialState: {} as {[id: string]: Channel},
  reducers: {
    add: (state, action: PayloadAction<Channel | Channel[]>) => {
      const payload = action.payload;
      const newState = {...state};
      [payload as Channel | Channel[]].flat().forEach((channel) => {
        newState[channel.id] = Object.assign(newState[channel.id] || {}, channel);
      });
      return newState;
    },
    remove: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const newState = {...state};
      delete newState[id];
      return newState;
    },
  },
});

export const methods = createMethods({
  module_name: 'channels',
  methods: {
    load: async (_arg, {dispatch: {actions}},{client}) => {
      const res = await client.req({ type: 'channel:getAll' });
      actions.channels.add(res.data);
    },
    create: async ({channelType, name, users}, {dispatch: {actions}}, {client}) => {
      const res = await client.req({
        type: 'channel:create', channelType, name, users,
      });
      actions.channels.add(res.data);
    },
    find: async (id, {dispatch: {actions}},{client}) => {
      const res = await client.req({ type: 'channel:get', id });
      actions.channels.add(res.data);
      return res.data;
    },
  },
});

export const { reducer, actions } = slice;
