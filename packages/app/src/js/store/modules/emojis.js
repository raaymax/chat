import {createModule} from '../tools';

export default createModule({
  name: 'emojis',
  initialState: [],
  reducers: {
    add: (state, action) => {
      const newState = [...state];
      [action.payload].flat().forEach((emoji) => {
        const idx = state.findIndex((e) => e.shortname === emoji.shortname);
        if (idx !== -1) {
          newState[idx] = { ...newState[idx], ...emoji, empty: false };
          return newState;
        }
        newState.push(emoji);
      });
      return newState;
    },
  },
  methods: {
    loadJSON: () => async ({actions}) => {
      const emojis = await import('../../../assets/emoji_list.json');
      if (emojis) actions.emojis.add(emojis.default);
    },

    loadCustom: () => async ({actions}, getState, {client}) => {
      const { data: emojis } = await client.req({ type: 'emojis:load' });
      if (emojis) actions.emojis.add(emojis.map((e) => ({...e, category: 'c'})));
    },

    find: (shortname) => async ({actions}, getState, {client}) => {
      try {
        const { data: [emoji] } = await client.req({ type: 'emoji:find', shortname });
        if (emoji) actions.emojis.add(emoji);
      } catch (err) {
        actions.emojis.add({ empty: true, shortname });
      }
    },
  },
});
