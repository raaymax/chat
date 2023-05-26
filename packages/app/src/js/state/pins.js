import { createReducer, createAction } from '@reduxjs/toolkit';

const addAll = createAction('pins/addAll');
const clear = createAction('pins/clear');

const pinsReducer = createReducer({
  data: {},
}, {
  [clear]: (state, action) => {
    const channelId = action.payload;
    state.data[channelId] = [];
  },
  [addAll]: ({ data }, action) => {
    action.payload.forEach((msg) => {
      const { channelId } = msg;
      // eslint-disable-next-line no-multi-assign
      const list = data[channelId] = data[channelId] || [];
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
    });
  },

  logout: () => ({ data: {} }),
});

export const actions = {
  clearPinMessages: clear,
  addPinMessages: addAll,
};

export default pinsReducer;
