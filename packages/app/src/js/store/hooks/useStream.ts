import { useSelector } from './useSelector';

export const useStream = (id: 'main' | 'side') => useSelector((state) => state.stream[id]);

export const useSideStream = () => useSelector((state) => state.stream.side);

export const useMainStream = () => useSelector((state) => state.stream.main);
