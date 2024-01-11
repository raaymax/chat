import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useUsers } from './useUsers';

export const useProgress = ({ channelId, parentId }) => {
  const channels = useSelector((state) => state.channels);
  const users = useUsers();
  const progress = useSelector((state) => state.progress);

  const channel = useMemo(() => Object.values(channels).find((c) => c.id === channelId), [channels, channelId]);

  return useMemo(() => (channel ? progress
    .filter((p) => p.channelId === channel.id)
    .filter((p) => (!p.parentId && !parentId) || p.parentId === parentId)
    .map((p) => ({
      ...p,
      user: users.find((u) => u.id === p.userId),
    }))
    .reduce((acc, p) => ({
      ...acc,
      [p.lastMessageId]: [...(acc[p.lastMessageId] || []), p],
    }), {}) : {}), [channel, progress, parentId, users]);
};
