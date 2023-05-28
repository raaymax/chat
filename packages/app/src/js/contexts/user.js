import { h, createContext } from 'preact';
import { useContext } from 'preact/hooks';

const Context = createContext(null);

export const UserContext = ({ children, value }) => (
  <Context.Provider value={value}>
    {children}
  </Context.Provider>
);

export const useUser = () => useContext(Context);
