import { useSelector } from './useSelector';

export const useUser = (userId: string) => useSelector((state) => state.users[userId]);
