import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export const useTyping = () => {
  const channelId = useSelector((state) => state.stream?.main?.channelId);
  const typing = useSelector((state) => state.typing[channelId]);
  const users = useSelector((state) => state.users);
  return useMemo(() => Object.keys(typing || {}).map((id) => users[id]), [typing, users]);
};
