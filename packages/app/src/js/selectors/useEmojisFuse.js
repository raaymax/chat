import Fuse from 'fuse.js';
import { useMemo } from 'preact/hooks';
import {useEmojis} from './useEmojis';

export const useEmojisFuse = () => {
  const emojis = useEmojis();
  return useMemo(() => new Fuse(emojis, {
    keys: ['name', 'shortname'],
    findAllMatches: true,
    includeMatches: true,
  }), [emojis]);
};
