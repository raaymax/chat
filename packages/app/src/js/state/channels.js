import { createReducer, createAction } from '@reduxjs/toolkit';

const add = createAction('channels/add');
const remove = createAction('channels/remove');
const set = createAction('channels/set');

const channelReducer = createReducer({ list: [], current: null }, {
  [add]: ({ list }, action) => {
    [action.payload].flat().forEach((channel) => {
      const existing = list.find((c) => c.id === channel.id);
      if (existing) {
        Object.assign(existing, channel);
        return;
      }
      let pos = list.findIndex((c) => c.createdAt > channel.createdAt);
      if (pos === -1 && list.some((c) => c.createdAt < channel.createdAt)) pos = list.length;
      list.splice(pos, 0, channel);
    });
  },
  [remove]: ({ list }, action) => {
    const id = action.payload;
    const idx = list.findIndex((c) => c.id === id);
    list[idx].deleted = true;
  },
  [set]: (state, action) => {
    if (!action.payload) {
      state.current = state.main;
    } else {
      state.current = action.payload;
    }
  },
  logout: () => ({ list: [], current: 'main' }),
});

export const actions = {
  addChannel: add,
  removeChannel: remove,
  setChannel: set,
};

export default channelReducer;
