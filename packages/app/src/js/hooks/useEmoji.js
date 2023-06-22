import { useMemo } from 'preact/hooks';
import { useSelector } from 'react-redux';

export const useEmoji = (shortname) => {
  const emojis = useSelector((state) => state.emojis);
  return useMemo(
    () => emojis.find((emoji) => emoji.shortname === shortname),
    [emojis, shortname],
  );
};
