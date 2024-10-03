import { useMemo } from 'react';
import { useSelector } from './useSelector';

export const useBadges = (userId: string | null | undefined) => {
  const progress = useSelector((state) => state.progress);
  return useMemo(() => progress
    .filter((p) => Boolean(p))
    .filter((p) => p.userId === userId)
    .filter((p) => !p.parentId)
    .reduce((acc, p) => ({
      ...acc,
      [p.channelId]: p.count,
    }), {}), [progress, userId]) as Record<string, number>;
};
