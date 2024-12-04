import { useSelector } from './useSelector';

export const useTyping = (channelId: string, parentId: string | null = null) => {
  const typing = useSelector((state) => state.typing.typings);
  const users = useSelector((state) => state.users);
  return [...new Set(typing.filter((t) => t.channelId === channelId && t.parentId === parentId).map((t) => users[t.userId]))];
};
