import {createReducer, createAction} from '@reduxjs/toolkit';

const CID = window.location.hash.slice(1);

const add = createAction('channels/add');
const remove = createAction('channels/remove');
const set = createAction('channels/set');

const channelReducer = createReducer({list: [], current: CID || 'main'}, {
  [add]: ({list}, action) => {
    [action.payload].flat().forEach((channel) => {
      const existing = list.find((c) => c.cid === channel.cid);
      if (existing) {
        Object.assign(existing, channel);
        return;
      }
      let pos = list.findIndex((c) => c.createdAt > channel.createdAt);
      if (pos === -1 && list.some((c) => c.createdAt < channel.createdAt)) pos = list.length;
      list.splice(pos, 0, channel);
    })
  },
  [remove]: ({list}, action) => {
    const cid = action.payload;
    const idx = list.findIndex((c) => c.cid === cid);
    if (idx > -1) {
      list.splice(idx, 1);
    }
  },
  [set]: (state, action) => {
    state.current = action.payload
  },
  logout: () => ({list: [], current: 'main'}),
})

export const actions = {
  addChannel: add,
  removeChannel: remove,
  setChannel: set,
}

export default channelReducer;
