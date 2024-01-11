import { useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

export const useEmoji = (shortname) => {
  const dispatch = useDispatch();
  const emojis = useSelector((state) => state.emojis);
  const emoji = useMemo(
    () => emojis.data.find((emoji) => emoji.shortname === shortname),
    [emojis, shortname],
  );
  useEffect(() => {
    if (!emoji && emojis.ready) {
      dispatch.methods.emojis.find(shortname);
    }
  }, [dispatch, emoji, shortname, emojis]);

  return emoji;
};
