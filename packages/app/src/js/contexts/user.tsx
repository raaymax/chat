import { createContext, useContext } from 'react';
import { User } from '../types';

const Context = createContext<User | undefined>(undefined);

type UserContextProps = {
  children: React.ReactNode;
  value: User;
};

export const UserContext = ({ children, value }: UserContextProps) => (
  <Context.Provider value={value}>
    {children}
  </Context.Provider>
);

export const useUser = (): User => {
  const user = useContext(Context);
  if (!user) throw new Error('useUser must be used within a UserContext');
  return user;
}
