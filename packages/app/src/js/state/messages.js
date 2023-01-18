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

export const getStream = (state, {channelId, parentId}) => {
  if (parentId) {
    const key = `${channelId}:${parentId}`;
    return state[key] || [];
  }
  return state[channelId] || [];
}

const useStream = (state, {channelId, parentId}) => {
  if (parentId) {
    const key = `${channelId}:${parentId}`;
    state[key] = state[key] || []
    return state[key];
  }
  state[channelId] = state[channelId] || [];
  return state[channelId];
}

const setStream = (state, {channelId, parentId}, list) => {
  if (parentId) {
    const key = `${channelId}:${parentId}`;
    state[key] = list;
  }
  state[channelId] = list;
}

const messagesReducer = createReducer({
  data: {},
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
  [clear]: (state, action) => {
    const {stream} = action.payload;
    setStream(state.data, stream, []);
  },
  [addAll]: ({data}, action) => {
    action.payload.forEach((msg) => {
      const {channelId, parentId} = msg;
      const list = useStream(data, {channelId, parentId});
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
  [add]: ({data, status}, action) => {
    if (status === 'archive') return;
    const msg = action.payload;
    const { channelId, parentId } = msg;
    const list = useStream(data, {channelId, parentId});
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
  },

  [takeHead]: (state, action) => {
    const {stream, count} = action.payload;
    const list = useStream(state.data, stream);
    const ids = list
      .slice(0, Math.max(list.length - count, 0))
      .map((m) => m.id)
    setStream(state.data, stream, list.filter((m) => !ids.includes(m.id)));
  },

  [takeTail]: (state, action) => {
    const {stream, count} = action.payload;
    const list = useStream(state.data, stream);
    const ids = list
      .slice(0, Math.min(count, list.length))
      .map((m) => m.id)

    setStream(state.data, stream, list.filter((m) => ids.includes(m.id)));
  },

  logout: () => ({ list: [], loading: false }),
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
    return client.req({ type: 'load', limit, channel });
  }),
  takeTail,
  takeHead,
};

export default messagesReducer;
