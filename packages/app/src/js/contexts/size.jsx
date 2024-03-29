import { useContext, createContext } from 'react';

const Context = createContext(null);

export const SizeContext = ({ children, value }) => (
  <Context.Provider value={value}>
    {children}
  </Context.Provider>
);

export const useSize = () => useContext(Context);
