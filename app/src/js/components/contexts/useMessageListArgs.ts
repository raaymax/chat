import {
  useContext,
} from 'react';
import { MessageListArgsContext } from './messageListArgs';
import { MessageListArgs } from '../../types';

type SetMessageListArgs = (stream: MessageListArgs) => void;

export const useMessageListArgs = (): [MessageListArgs, SetMessageListArgs] => {
  const [state, setState] = useContext(MessageListArgsContext);
  if (typeof state === undefined) throw new Error('useMessageListArgs must be used within a MessageListArgsContext');

  return [
    state,
    setState,
  ];
};
