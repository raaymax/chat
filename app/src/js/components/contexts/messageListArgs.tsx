import { createContext, useState } from 'react';
import { MessageListArgs } from '../../types';

type SetMessageListArgs = (stream: MessageListArgs) => void;

export const MessageListArgsContext = createContext<[MessageListArgs, SetMessageListArgs]>([{type: 'live', id: 'main'}, () => ({})]);

type MessageListArgsParams = {
  children: React.ReactNode;
  streamId: string;
};

export const MessageListArgsProvider = ({ streamId, children}: MessageListArgsParams) => {
  const [state, setState] = useState<MessageListArgs>({type: 'live', id: streamId});
  return (
    <MessageListArgsContext.Provider value={[state, (a) => setState({...a, id: streamId})]}>
      {children}
    </MessageListArgsContext.Provider>
  );
}
