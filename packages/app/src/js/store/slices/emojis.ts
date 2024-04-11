import { createSlice } from '@reduxjs/toolkit';
import { createMethods } from '../tools';
import { EmojiDescriptor } from '../../types';

type EmojiState = {
  ready: boolean;
  data: EmojiDescriptor[];
};

const slice = createSlice({
  name: 'emojis',
  initialState: {ready: false, data: []} as EmojiState,
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
});

export const methods = createMethods({
  module_name: 'emojis',
  methods: {
    load: async (_arg, {dispatch: {actions}}, {client}) => {
      const [baseEmojis, { data: emojis }] = await Promise.all([
        import('../../../assets/emoji_list.json'),
        client.req({ type: 'emoji:getAll' }),
      ]);
      actions.emojis.add(baseEmojis.default);
      actions.emojis.add(emojis.map((e: any) => ({...e, category: 'c'})));
      actions.emojis.ready({});
    },

    find: async (shortname, {dispatch: {actions}}, {client}) => {
      try {
        const { data: [emoji] } = await client.req({ type: 'emoji:get', shortname });
        if (emoji) actions.emojis.add(emoji);
      } catch (err) {
        // ignore
      }
    },
  },
});


export const { actions, reducer } = slice;
