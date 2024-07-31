import { useSelector } from './useSelector';

export const useMainChannelId = () => useSelector((state) => state.stream.mainChannelId);
