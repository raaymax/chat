import Fuse from 'fuse.js';
import { client } from '../core';
import Emojis from '../../assets/emoji_list.json';
import {actions} from '../state';
import {logErrors} from './logger';

window.EMOJI = Emojis;

export default Emojis;

export const emojiFuse = new Fuse(Emojis, {
  isCaseSensitive: true,
  includeScore: false,
  shouldSort: true,
  includeMatches: false,
  findAllMatches: false,
  minMatchCharLength: 1,
  location: 0,
  threshold: 0.1,
  distance: 100,
  useExtendedSearch: true,
  ignoreLocation: false,
  ignoreFieldNorm: false,
  fieldNormWeight: 1,
  keys: [
    'name',
    'shortname',
  ],
});

window.ef = emojiFuse;

let fuse;
let custom = null;
export const getEmojiFuse = (store) => {
  if (custom !== store.getState().customEmojis) {
    custom = store.getState().customEmojis;
    fuse = new Fuse([
      ...Emojis,
      ...store.getState().customEmojis.filter((e) => !e.empty),
    ], {
      isCaseSensitive: true,
      includeScore: false,
      shouldSort: true,
      includeMatches: false,
      findAllMatches: false,
      minMatchCharLength: 1,
      location: 0,
      threshold: 0.1,
      distance: 100,
      useExtendedSearch: true,
      ignoreLocation: false,
      ignoreFieldNorm: false,
      fieldNormWeight: 1,
      keys: [
        'name',
        'shortname',
      ],
    });
  }
  return fuse;
};

export const getEmojis = async (store) => [
  ...Emojis,
  ...store.getState().customEmojis.filter((e) => !e.empty).map((e) => ({
    ...e,
    category: 'c',
  })),
]

export const loadJSON = () => logErrors(async (dispatch) => {
  const emojis = await import('../../assets/emoji_list.json');
  if (emojis) {
    emojis.default.forEach((emoji) => {
      dispatch(actions.addEmoji(emoji));
    });
  }
})

export const loadCustom = () => logErrors(async (dispatch) => {
  const {data: emojis} = await client.req({ type: 'emojis:load' });
  if (emojis) {
    emojis.forEach((emoji) => {
      dispatch(actions.addEmoji({...emoji, category: 'c'}));
    });
  }
})

export const loadEmojis = () => async (dispatch) => Promise.all([
  dispatch(loadJSON()),
  dispatch(loadCustom()),
])

export const findEmoji = (shortname) => async (dispatch) => {
  try {
    const {data: [emoji]} = await client.req({ type: 'emoji:find', shortname });
    if (emoji) {
      dispatch(actions.addEmoji(emoji));
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    dispatch(actions.addEmoji({empty: true, shortname}));
  }
}
