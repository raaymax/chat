import { useMemo } from 'react';
import { useSelector } from './useSelector';

export const useDirectChannel = (userId: string) => {
  const meId = useSelector((state) => state.me);
  const channels = useSelector((state) => state.channels);
  return useMemo(() => Object.values(channels).find((c) => (
    c.direct === true
      && c.users.includes(userId)
      && (userId === meId
        ? (c.users.length === 2 && c.users.every((u) => u === meId))
        : true ))) || null, [channels, userId, meId]);
};
