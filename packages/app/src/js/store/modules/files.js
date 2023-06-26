import {createModule} from '../tools';

export const findIdx = (list, id) => list.findIndex((f) => (f.id && f.id === id)
    || (f.clientId && f.clientId === id));

export default createModule({
  name: 'files',
  initialState: [],
  reducers: {
    add: (state, action) => ([...state, ...[action.payload].flat()]),
    update: (state, action) => {
      const idx = findIdx(state, action.payload.id);
      if (idx === -1) return;
      const newState = [...state];
      newState[idx] = { ...newState[idx], ...action.payload.file};
      return newState;
    },
    remove: (state, action) => {
      const idx = findIdx(state, action.payload);
      if (idx === -1) return;
      const newState = [...state];
      newState.splice(idx, 1);
      return newState;
    },
    clear: (state, action) => state.filter((f) => f.streamId !== action.payload),
  },
});
