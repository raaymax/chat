import Fuse from 'fuse.js';
import Emojis from '../../assets/emoji_list.json';

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
