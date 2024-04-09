import { createContext } from 'react';
import { Message } from '../../types';

export const MessageContext = createContext<{data?: Message}>({});

export const MessageProvider = ({ children, value}: {children: React.ReactNode, value: Message}) => (
  <MessageContext.Provider value={{data: value}}>
    {children}
  </MessageContext.Provider>
);
