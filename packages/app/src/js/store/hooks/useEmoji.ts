import { useMemo, useEffect } from 'react';
import { useSelector } from './useSelector';
import { useMethods } from './useMethods';
import { EmojiDescriptor } from '../../types';

export const useEmoji = (shortname: string): EmojiDescriptor => {
  const emojis = useSelector((state) => state.emojis);
  const methods = useMethods();
  const emoji = useMemo(
    () => emojis.data.find((e) => e.shortname === shortname),
    [emojis, shortname],
  );
  useEffect(() => {
    if (!emoji && emojis.ready) {
      methods.emojis.find(shortname);
    }
  }, [methods, emoji, shortname, emojis]);

  return emoji ?? { shortname, empty: true };
};
