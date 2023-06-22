import { useSelector } from 'react-redux';

export const useMainChannelId = () => useSelector((state) => state.channels.main);
