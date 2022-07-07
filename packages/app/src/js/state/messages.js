import {createReducer, createAsyncThunk, createAction} from '@reduxjs/toolkit';
import {client} from '../core';

const SPAN = 50;

const add = createAction('message/add');
const removeBefore = createAction('message/remove/before');

const messagesReducer = createReducer({list: [], loading: false}, {
  [add]: ({list}, action) => {
    const msg = action.payload;
    if (msg.createdAt) {
      msg.createdAt = (new Date(msg.createdAt)).toISOString();
    }
    const existing = list.find((m) => (m.id && m.id === msg.id)
      || (m.clientId && m.clientId === msg.clientId));

    if (existing) {
      Object.assign(existing, msg);
      return;
    }
    let pos = list.findIndex((m) => m.createdAt > msg.createdAt);
    if (pos === -1 && list.some((m) => m.createdAt < msg.createdAt)) pos = list.length;
    list.splice(pos, 0, msg);
  },
  [removeBefore]: (state, action) => {
    const id = action.payload;
    const idx = state.list.findIndex((m) => m.id === id || m.clientId === id);
    if (idx === -1) return;
    if (idx - SPAN <= 0) return;
    state.list = [
      ...state.list.slice(Math.max(0, idx - SPAN), idx),
      ...state.list.slice(idx),
    ];
  },
  logout: () => ({ list: [], loading: false }),
})

export const actions = {
  addMessage: add,
  removeMessagesBefore: removeBefore,
  loadMessages: createAsyncThunk('messages/load', async ({limit = 50}, {getState}) => {
    const {channel} = getState();
    return client.req({ type: 'load', limit, channel });
  }),
};

export default messagesReducer;
