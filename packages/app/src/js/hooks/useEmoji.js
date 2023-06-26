import { useMemo } from 'preact/hooks';
import { useSelector, useDispatch } from 'react-redux';

export const useEmoji = (shortname) => {
  const dispatch = useDispatch();
  const emojis = useSelector((state) => state.emojis);
  const emoji = useMemo(
    () => emojis.find((emoji) => emoji.shortname === shortname),
    [emojis, shortname],
  );
  if (!emoji) {
    dispatch.methods.emojis.find(shortname);
  }

  return emoji;
};
