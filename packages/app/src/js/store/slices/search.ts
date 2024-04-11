import { createSlice } from "@reduxjs/toolkit";
import { createMethods } from "../tools";
import { Message } from "../../types";

type SearchState = {
  results: Message[];
  text: string;
};

const slice = createSlice({
  name: 'search',
  initialState: {results: [], text: ''} as SearchState,
  reducers: {
    push: (state, action) => ({...state, results: [action.payload, ...state.results.slice(0, 5)]}),
    set: (state, action) => ({...state, text: action.payload}),
    clear: () => ({results: [], text: ''}),
  },
});

export const methods = createMethods({
  module_name: 'search',
  methods: {
    find: async ({channelId, text}, {dispatch: {actions}}, {client}) => {
      const data = await client.req({ type: 'message:search', channelId, text });
      actions.search.push({ text, data: data.data, searchedAt: new Date().toISOString() });
    },
  },
});

export const { reducer, actions } = slice;
