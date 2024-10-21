import { createSlice } from '@reduxjs/toolkit';

type File = {
  id: string;
  clientId: string;
  streamId: string;
  status: string;
  fileSize: number;
  fileName: string;
  contentType: string;
  progress: number;
  file: {
    name: string;
    type: string;
    size: number;
  };
};

export const findIdx = (list: File[], id: string) => list.findIndex((f) => (f.id && f.id === id)
    || (f.clientId && f.clientId === id));

export default createSlice({
  name: 'files',
  initialState: [] as File[],
  reducers: {
    add: (state, action) => ([...state, ...[action.payload].flat()] as File[]),
    update: (state, action) => {
      const payload = (action.payload as File);
      const idx = findIdx(state, payload.id);
      if (idx === -1) return state;
      const newState = [...state];
      newState[idx] = { ...newState[idx], ...payload.file };
      return newState;
    },
    remove: (state, action) => {
      const id = (action.payload as string);
      const idx = findIdx(state, id);
      if (idx === -1) return state;
      const newState = [...state];
      newState.splice(idx, 1);
      return newState;
    },
    clear: (state, action) => state.filter((f) => f.streamId !== action.payload),
  },
});
