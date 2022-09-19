import {
  createReducer, createAction,
} from '@reduxjs/toolkit';

const set = createAction('searchInput/set');
const addResult = createAction('searchInput/addResult');
const clear = createAction('searchInput/clear');

const searchReducer = createReducer({text: '', results: []}, {
  [set]: (state, action) => {
    state.text = action.payload;
  },
  [addResult]: (state, action) => {
    state.results.push(action.payload);
  },
  [clear]: () => ({text: '', results: []}),
  logout: () => ({text: '', results: []}),
});

export const actions = {
  setSearchInput: set,
  addSearchResult: addResult,
  clearSearchResults: clear,
}

export default searchReducer;
