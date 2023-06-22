import { useMemo } from 'preact/hooks';
import { useSelector } from 'react-redux';
import Fuse from 'fuse.js';

export const useEmojiFuse = () => {
  const emojis = useSelector((state) => state.emojis);
  return useMemo(() => new Fuse(emojis.filter((e) => !e.empty), {
    findAllMatches: true,
    includeMatches: true,
    keys: [
      'name',
      'shortname',
    ],
  }), [emojis]);
}
