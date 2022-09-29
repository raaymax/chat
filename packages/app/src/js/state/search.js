import {
  createReducer, createAction,
} from '@reduxjs/toolkit';

const set = createAction('searchInput/set');
const clear = createAction('searchInput/clear');
const add = createAction('searchInput/add');

const searchReducer = createReducer({results: []}, {
  [add]: (state, action) => {
    state.results = [action.payload, ...state.results.slice(0, 5)];
  },
  [set]: (state, action) => {
    state.text = action.payload;
  },
  [clear]: () => ({results: []}),
  logout: () => ({text: '', results: []}),
});

export const actions = {
  setSearchInput: set,
  addSearchResult: add,
  clearSearchResults: clear,
}

export default searchReducer;
