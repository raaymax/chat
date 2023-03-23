import {createReducer, createAsyncThunk, createAction} from '@reduxjs/toolkit';
import {client} from '../core';

const add = createAction('message/add');
const hover = createAction('message/hover');
const setStatus = createAction('message/set/status');
const loadingFailed = createAction('message/loading/failed');
const loading = createAction('message/loading/next');
const loadingDone = createAction('message/loading/next/done');
const addAll = createAction('message/addAll');
const removeBefore = createAction('message/remove/before');
const takeHead = createAction('message/take/head');
const takeTail = createAction('message/take/tail');
const clear = createAction('message/clear');
const select = createAction('message/select');

const messagesReducer = createReducer({
  data: [],
  loading: false,
  status: 'live',
  selected: null,
  hovered: null,
}, {
  [hover]: (state, action) => {
    state.hovered = action.payload;
  },
  [select]: (state, action) => {
    state.selected = action.payload;
  },
  [setStatus]: (state, action) => {
    state.status = action.payload;
  },
  [loadingFailed]: (state, action) => {
    state.loadingFailed = action.payload;
  },
  [loading]: (state) => {
    state.loading = true;
  },
  [loadingDone]: (state) => {
    state.loading = false;
  },
  [clear]: ({data}, action) => {
    const {stream: {parentId, channelId}} = action.payload;
    const ids = data
      .filter(((m) => m.channelId === channelId && (!parentId || m.parentId === parentId)))
      .map((m) => m.id)

    data = data.filter((m) => !ids.includes(m.id))
  },
  [addAll]: ({data}, action) => {
    action.payload.forEach((msg) => {
      if (msg.createdAt) {
        msg.createdAt = (new Date(msg.createdAt)).toISOString();
      }
      const existing = data.find((m) => (m.id && m.id === msg.id)
        || (m.clientId && m.clientId === msg.clientId));

      if (existing) {
        Object.assign(existing, msg);
        return;
      }
      let pos = data.findIndex((m) => m.createdAt < msg.createdAt);
      if (pos === -1 && data.some((m) => m.createdAt > msg.createdAt)) pos = data.length;
      data.splice(pos, 0, msg);
    })
  },
  [add]: ({data, status}, action) => {
    if (status === 'archive') return;
    const msg = action.payload;
    if (msg.createdAt) {
      msg.createdAt = (new Date(msg.createdAt)).toISOString();
    }
    const existing = data.find((m) => (m.id && m.id === msg.id)
      || (m.clientId && m.clientId === msg.clientId));

    if (existing) {
      Object.assign(existing, msg);
      return;
    }
    let pos = data.findIndex((m) => m.createdAt < msg.createdAt);
    if (pos === -1 && data.some((m) => m.createdAt > msg.createdAt)) pos = data.length;
    data.splice(pos, 0, msg);
  },

  [takeHead]: ({ data }, action) => {
    const {stream: {channelId, parentId}, count} = action.payload;
    const ids = data
      .filter((m) => m.channelId === channelId && (!parentId || m.parentId === parentId))
      .slice(0, Math.max(data.length - count, 0))
      .map((m) => m.id);
    data = data.filter((m) => !ids.includes(m.id));
  },

  [takeTail]: ({data}, action) => {
    const {stream: {channelId, parentId}, count} = action.payload;
    const ids = data
      .filter((m) => m.channelId === channelId && (!parentId || m.parentId === parentId))
      .slice(0, Math.min(count, data.length))
      .map((m) => m.id)

    data = data.filter((m) => !ids.includes(m.id))
  },

  logout: () => ({ data: [], loading: false }),
})

export const actions = {
  messagesSetStatus: setStatus,
  messagesLoadingFailed: loadingFailed,
  messagesLoading: loading,
  messagesLoadingDone: loadingDone,
  messagesClear: clear,
  selectMessage: select,
  hoverMessage: hover,
  addMessages: addAll,
  addMessage: add,
  removeMessagesBefore: removeBefore,
  loadMessages: createAsyncThunk('messages/load', async ({limit = 50}, {getState}) => {
    const {channel} = getState();
    return client.notif({ type: 'messages:load', limit, channel });
  }),
  takeTail,
  takeHead,
};

export default messagesReducer;
