import {createReducer, createAsyncThunk, createAction} from '@reduxjs/toolkit';
import {client} from '../core';

const SPAN = 50;

const addAll = createAction('pins/addAll');
const clear = createAction('pins/clear');

const pinsReducer = createReducer({
  data: {},
}, {
  [clear]: (state, action) => {
    const channel = action.payload;
    state.data[channel] = [];
  },
  [addAll]: ({data}, action) => {
    action.payload.forEach((msg) => {
      const {channel} = msg;
      const list = data[channel] = data[channel] || [];
      if (msg.createdAt) {
        msg.createdAt = (new Date(msg.createdAt)).toISOString();
      }
      const existing = list.find((m) => (m.id && m.id === msg.id)
        || (m.clientId && m.clientId === msg.clientId));

      if (existing) {
        Object.assign(existing, msg);
        return;
      }
      let pos = list.findIndex((m) => m.createdAt < msg.createdAt);
      if (pos === -1 && list.some((m) => m.createdAt > msg.createdAt)) pos = list.length;
      list.splice(pos, 0, msg);
    })
  },

  logout: () => ({ data: {} }),
})

export const actions = {
  clearPinMessages: clear,
  addPinMessages: addAll,
};

export default pinsReducer;
