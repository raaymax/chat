import Fuse from 'fuse.js';
import { client } from '../core';
import Emojis from '../../assets/emoji_list.json';
import {actions} from '../state';

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

export const findEmoji = (shortname) => async (dispatch) => {
  console.log('findEmoji', shortname);
  try {
    const {data:[emoji]} = await client.req2({ type: 'findEmoji', shortname });
    if(emoji){
      dispatch(actions.addEmoji(emoji));
    }
    console.log(data);
  } catch (err) {
    dispatch(actions.addEmoji({empty: true, shortname}));
  }
}
