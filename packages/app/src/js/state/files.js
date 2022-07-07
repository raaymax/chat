import {createReducer, createAction} from '@reduxjs/toolkit';

const add = createAction('files/add');
const update = createAction('files/update');
const remove = createAction('files/remove');
const clear = createAction('files/clear');

export const findOne = (list, id) => list.find((f) => (f.id && f.id === id)
    || (f.clientId && f.clientId === id));

export const findIdx = (list, id) => list.findIndex((f) => (f.id && f.id === id)
    || (f.clientId && f.clientId === id));

const reducer = createReducer({list: []}, {
  [add]: ({list}, action) => { list.push(action.payload); },
  [update]: ({list}, action) => {
    const found = findOne(list, action.payload.id);
    if (!found) return;
    Object.assign(found, action.payload.file);
  },
  [remove]: ({list}, action) => {
    const idx = findIdx(list, action.payload);
    if (idx === -1) return;
    list.splice(idx, 1);
  },
  [clear]: ({list}) => {
    list.length = 0;
  },
  logout: () => ({ list: [] }),
})

export const actions = {
  addFile: add,
  removeFile: remove,
  updateFile: update,
  clearFiles: clear,
};

export const filesAreReady = ({list}) => list.every((f) => f.progress === 100);

export default reducer;
