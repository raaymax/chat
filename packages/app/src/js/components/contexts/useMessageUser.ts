import { useContext } from 'react';
import { MessageContext } from './message';
import { useUser } from '../../store';

export const useMessageUser = () => {
  const context = useContext(MessageContext);
  const { userId } = context.data || {};
  return useUser(userId);
};
