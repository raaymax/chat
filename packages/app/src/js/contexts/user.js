import { createContext, useContext } from 'react';

const Context = createContext(null);

export const UserContext = ({ children, value }) => (
  <Context.Provider value={value}>
    {children}
  </Context.Provider>
);

export const useUser = () => useContext(Context);
