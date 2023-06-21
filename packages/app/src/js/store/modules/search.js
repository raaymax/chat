import {createModule} from '../tools';

export default createModule({
  name: 'search',
  initialState: {results: [], text: ''},
  reducers: {
    push: (state, action) => ({...state, results: [action.payload, ...state.results.slice(0, 5)]}),
    set: (state, action) => ({...state, text: action.payload}),
    clear: () => ({results: [], text: ''}),
  },
  methods: {
    find: (channelId, text) => async ({actions}, getState, {client}) => {
      const data = await client.req({ type: 'messages:search', channelId, text });
      actions.search.push({ text, data: data.data, searchedAt: new Date().toISOString() });
    },
  }
});
