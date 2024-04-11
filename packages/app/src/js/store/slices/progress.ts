import { createSlice } from "@reduxjs/toolkit";
import { createMethods } from "../tools";

type ProgressState = {
  channelId: string;
  userId: string;
  parentId: string;
};

const slice = createSlice({
  name: 'progress',
  initialState: [] as ProgressState[],
  reducers: {
    add: (state, action) => {
      const newState = [...state];
      [action.payload].flat().forEach((progress) => {
        const idx = newState.findIndex((item) => item.channelId === progress.channelId
          && item.userId === progress.userId && item.parentId === progress.parentId);
        if (idx !== -1) {
          newState[idx] = { ...newState[idx], ...progress };
          return newState;
        }
        newState.push(progress);
      });
      return newState;
    },
  },
});

export const methods = createMethods({
  module_name: 'progress',
  methods: {
    loadBadges: async (_arg, {dispatch: {actions}}, {client}) => {
      const { data } = await client.req({
        type: 'readReceipt:getOwn',
      });
      actions.progress.add(data);
    },

    loadProgress: async (stream, {dispatch: {actions}}, {client}) => {
      try{
        if (!stream.channelId) return;
        const { data } = await client.req({
          type: 'readReceipt:getChannel',
          channelId: stream.channelId,
          parentId: stream.parentId,
        });
        actions.progress.add(data);
      }catch(err){
        // eslint-disable-next-line no-console
        console.error(err)
      }
    },

    update: async (messageId, {dispatch: {actions}}, {client}) => {
      const { data } = await client.req({
        type: 'readReceipt:update',
        messageId,
      });
      actions.progress.add(data);
    },
  },
});

export const { reducer, actions } = slice;
