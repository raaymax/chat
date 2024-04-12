import { useMemo, useEffect } from 'react';
import { useSelector } from './useSelector';
import { useMethod } from './useMethod';

type Emoji = {
  shortname: string;
  unicode?: string;
  fileId?: string;
  empty?: boolean;
};

export const useEmoji = (shortname: string): Emoji => {
  const emojis = useSelector((state) => state.emojis);
  const { emojis: {find}} = useMethod();
  const emoji = useMemo(
    () => emojis.data.find((emoji: Emoji) => emoji.shortname === shortname),
    [emojis, shortname],
  );
  useEffect(() => {
    if (!emoji && emojis.ready) {
      find(shortname);
    }
  }, [find, emoji, shortname, emojis]);

  return emoji ?? { shortname, empty: true};
};
