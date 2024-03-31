import { useContext, createContext } from 'react';
import { useUser } from '../hooks';
import { Message } from '../types';

const Context = createContext<{data?: Message}>({});

export const MessageContext = ({ children, value}: {children: React.ReactNode, value: Message}) => (
  <Context.Provider value={{data: value}}>
    {children}
  </Context.Provider>
);

export const useMessageData = (): Message => {
  const context = useContext(Context);
  if(context.data === undefined) throw new Error('useMessageData must be used within a MessageContext');
  return context.data;
};

export const useMessageUser = () => {
  const context = useContext(Context);
  if(context.data === undefined) return {};
  const { userId } = context.data;
  return useUser(userId);
};

