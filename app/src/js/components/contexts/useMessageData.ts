import { useContext } from 'react';
import { MessageContext } from './message';
import { Message } from '../../types';

export const useMessageData = (): Message => {
  const context = useContext(MessageContext);
  if (context.data === undefined) throw new Error('useMessageData must be used within a MessageContext');
  return context.data;
};
