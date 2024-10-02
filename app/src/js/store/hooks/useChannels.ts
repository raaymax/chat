import { useMemo } from 'react';
import { useSelector } from './useSelector';

export const useChannels = () => {
  const channels = useSelector((state) => state.channels);
  const meId = useSelector((state) => state.me);
  return useMemo(
    () => Object.values(channels)
      .filter((channel) => channel.channelType !== 'DIRECT' && channel.users.includes(meId ?? '')),
    [channels, meId],
  );
};
