import { useContext, createContext } from 'react';
import { useUser } from '../hooks';

const Context = createContext({
  data: {},
});

export const MessageContext = ({ children, value }) => (
  <Context.Provider value={value}>
    {children}
  </Context.Provider>
);

export const useMessageData = () => {
  const context = useContext(Context);
  return context.data;
};

export const useMessageUser = () => {
  const context = useContext(Context);
  const { userId } = context.data;
  return useUser(userId);
};
