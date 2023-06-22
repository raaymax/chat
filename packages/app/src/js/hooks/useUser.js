import { useSelector } from 'react-redux';

export const useUser = (userId) => useSelector((state) => state.users[userId]);
