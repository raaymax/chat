import {createModule} from '../tools';

export default createModule({
  name: 'emojis',
  initialState: {ready: false, data: []},
  reducers: {
    ready: (state) => ({...state, ready: true}),
    add: (state, action) => {
      const newState = {...state, data: [...state.data]};
      [action.payload].flat().forEach((emoji) => {
        const idx = state.data.findIndex((e) => e.shortname === emoji.shortname);
        if (idx !== -1) {
          newState.data[idx] = { ...newState.data[idx], ...emoji };
          return newState;
        }
        newState.data.push(emoji);
      });
      return newState;
    },
  },
  methods: {
    load: () => async ({actions}, getState, {client}) => {
      const [baseEmojis, { data: emojis }] = await Promise.all([
        import('../../../assets/emoji_list.json'),
        client.req({ type: 'emoji:getAll' }),
      ]);
      actions.emojis.add(baseEmojis.default);
      actions.emojis.add(emojis.map((e) => ({...e, category: 'c'})));
      actions.emojis.ready({});
    },

    find: (shortname) => async ({actions}, getState, {client}) => {
      try {
        const { data: [emoji] } = await client.req({ type: 'emoji:get', shortname });
        if (emoji) actions.emojis.add(emoji);
      } catch (err) {
        // ignore
      }
    },
  },
});
