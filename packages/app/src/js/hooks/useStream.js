import { useSelector } from 'react-redux';

export const useStream = (id) => useSelector((state) => state?.stream?.[id]);
