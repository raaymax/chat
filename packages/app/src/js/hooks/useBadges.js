import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export const useBadges = (userId) => {
  const progress = useSelector((state) => state.progress);
  return useMemo(() => progress
    .filter((p) => p.userId === userId)
    .filter((p) => !p.parentId)
    .reduce((acc, p) => ({
      ...acc,
      [p.channelId]: p.count,
    }), {}), [progress, userId]);
};
