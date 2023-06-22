import { useMemo } from 'preact/hooks';
import { useSelector } from 'react-redux';

export const useChannels = () => {
  const channels = useSelector((state) => state.channels);
  const meId = useSelector((state) => state.me);
  return useMemo(
    () => Object.values(channels)
      .filter((channel) => channel.channelType !== 'DIRECT' && channel.users.includes(meId)),
    [channels, meId],
  );
};
