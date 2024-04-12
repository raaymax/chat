import { useSelector } from './useSelector';

export const useStream = (id: 'main' | 'side') => useSelector((state) => state?.stream?.[id]);
