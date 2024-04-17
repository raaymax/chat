import { useMemo, useEffect } from 'react';
import { useSelector } from './useSelector';
import { useMethods } from './useMethods';

type Emoji = {
  shortname: string;
  unicode?: string;
  fileId?: string;
  empty?: boolean;
};

export const useEmoji = (shortname: string): Emoji => {
  const emojis = useSelector((state) => state.emojis);
  const methods = useMethods();
  const emoji = useMemo(
    () => emojis.data.find((emoji: Emoji) => emoji.shortname === shortname),
    [emojis, shortname],
  );
  useEffect(() => {
    if (!emoji && emojis.ready) {
      methods.emojis.find(shortname);
    }
  }, [methods, emoji, shortname, emojis]);

  return emoji ?? { shortname, empty: true};
};
