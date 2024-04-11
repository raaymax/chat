import { createSlice } from '@reduxjs/toolkit';
import { Message } from '../../types';
import { createMethods } from '../tools';

type PinsState = {
  [channelId: string]: Message[];
};

const slice = createSlice({
  name: 'pins',
  initialState: {} as PinsState,
  reducers: {
    add: (state, action) => {
      const newState = { ...state };
      [action.payload].flat().forEach((msg) => {
        const { channelId } = msg;
         
        const list = newState[channelId] = newState[channelId] || [];
        if (msg.createdAt) {
          msg.createdAt = (new Date(msg.createdAt)).toISOString();
        }
        const idx = list.findIndex((m) => (m.id && m.id === msg.id)
          || (m.clientId && m.clientId === msg.clientId));
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...msg};
          return;
        }
        let pos = list.findIndex((m) => m.createdAt < msg.createdAt);
        if (pos === -1 && list.some((m) => m.createdAt > msg.createdAt)) pos = list.length;
        list.splice(pos, 0, msg);
      });
      return newState;
    },
    clear: (state, action) => {
      const newState = { ...state };
      const { channelId } = action.payload;
      newState[channelId] = [];
      return newState;
    },
  },
});

export const methods = createMethods({
  module_name: 'pins',
  methods: {
    load: async (channelId, {dispatch: {actions}}, {client}) => {
      actions.pins.clear(channelId);
      const req = await client.req({
        type: 'message:pins',
        channelId,
        limit: 50,
      });
      actions.pins.add(req.data);
    },
    pin: async ({id, channelId}, {dispatch: {actions, methods}}, {client}) => {
      const req = await client.req({
        type: 'message:pin',
        channelId,
        id,
        pinned: true,
      });
      actions.messages.add(req.data);
      await methods.pins.load(channelId);
    },

    unpin: async ({id, channelId}, {dispatch: {actions, methods}}, {client}) => {
      const req = await client.req({
        type: 'message:pin',
        channelId,
        id,
        pinned: false,
      });
      actions.messages.add(req.data);
      await methods.pins.load(channelId);
    },
  },
});

export const { reducer, actions } = slice;

