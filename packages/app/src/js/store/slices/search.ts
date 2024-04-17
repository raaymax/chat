import { createSlice } from "@reduxjs/toolkit";
import { Message } from "../../types";

type Result = {
  id: string;
  text: string;
  searchedAt: string;
  data: Message[];
};

type SearchState = {
  results: Result[];
  text: string;
};

export default createSlice({
  name: 'search',
  initialState: {results: [], text: ''} as SearchState,
  reducers: {
    push: (state, action) => ({...state, results: [action.payload, ...state.results.slice(0, 5)]}),
    set: (state, action) => ({...state, text: action.payload}),
    clear: () => ({results: [], text: ''}),
  },
});

