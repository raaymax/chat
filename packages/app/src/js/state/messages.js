import {createReducer, createAsyncThunk, createAction} from '@reduxjs/toolkit';
import {client} from '../core';

const add = createAction('message/add');
const hover = createAction('message/hover');
const setStatus = createAction('message/set/status');
const loadingNext = createAction('message/loading');
const loadingNextDone = createAction('message/loading/done');
const loadingFailed = createAction('message/loading/failed');
const loadingPrev = createAction('message/loading/prev');
const loadingPrevDone = createAction('message/loading/prev/done');
const loading = createAction('message/loading/next');
const loadingDone = createAction('message/loading/next/done');
const addAll = createAction('message/addAll');
const removeBefore = createAction('message/remove/before');
const takeHead = createAction('message/take/head');
const takeTail = createAction('message/take/tail');
const clear = createAction('message/clear');
const select = createAction('message/select');

const messagesReducer = createReducer({
  data: {},
  loadingPrevios: false,
  loadingNext: false,
  loading: true,
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
  [loadingNext]: (state) => {
    state.loadingNext = true;
  },
  [loadingNextDone]: (state) => {
    state.loadingNext = false;
  },
  [loadingPrev]: (state) => {
    state.loadingNext = true;
  },
  [loadingPrevDone]: (state) => {
    state.loadingNext = false;
  },
  [clear]: (state, action) => {
    const {channel} = action.payload;
    state.data[channel] = [];
  },
  [addAll]: ({data}, action) => {
    action.payload.forEach((msg) => {
      const {channel} = msg;
      // eslint-disable-next-line no-multi-assign
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
  [add]: ({data, status}, action) => {
    if (status === 'archive') return;
    const msg = action.payload;
    const {channel} = msg;
    // eslint-disable-next-line no-multi-assign
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
  },

  [takeHead]: (state, action) => {
    const {channel, count} = action.payload;
    const ids = state.data[channel]
      .slice(0, Math.max(state.data[channel].length - count, 0))
      .map((m) => m.id)
    state.data[channel] = state.data[channel].filter((m) => !ids.includes(m.id));
  },

  [takeTail]: (state, action) => {
    const {channel, count} = action.payload;
    const ids = state.data[channel]
      .slice(0, Math.min(count, state.data[channel].length))
      .map((m) => m.id)
    state.data[channel] = state.data[channel].filter((m) => ids.includes(m.id));
  },

  logout: () => ({ list: [], loading: false }),
})

export const actions = {
  messagesSetStatus: setStatus,
  messagesLoadingFailed: loadingFailed,
  messagesLoading: loading,
  messagesLoadingDone: loadingDone,
  messagesLoadingNext: loadingNext,
  messagesLoadingNextDone: loadingNextDone,
  messagesLoadingPrev: loadingPrev,
  messagesLoadingPrevDone: loadingPrevDone,
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
