import { useSelector } from './useSelector';

export const useUser = (userId: string | undefined | null) => useSelector((state) => userId ? state.users[userId] : null);
