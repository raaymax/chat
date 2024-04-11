import { useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from '../store';

type Emoji = {
  shortname: string;
  unicode?: string;
  fileId?: string;
  empty?: boolean;
};

export const useEmoji = (shortname: string): Emoji => {
  const dispatch = useDispatch();
  const emojis = useSelector((state) => state.emojis);
  const emoji = useMemo(
    () => emojis.data.find((emoji: Emoji) => emoji.shortname === shortname),
    [emojis, shortname],
  );
  useEffect(() => {
    if (!emoji && emojis.ready) {
      dispatch.methods.emojis.find(shortname);
    }
  }, [dispatch, emoji, shortname, emojis]);

  return emoji ?? { shortname, empty: true};
};
