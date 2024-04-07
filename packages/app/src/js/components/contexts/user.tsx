import { createContext, useContext } from 'react';

const Context = createContext<string | null>(null);

type UserContextProps = {
  children: React.ReactNode;
  value: string | null;
};

export const UserContext = ({ children, value }: UserContextProps) => (
  <Context.Provider value={value}>
    {children}
  </Context.Provider>
);

export const useUser = (): string | null=> {
  const user = useContext(Context);
  if (!user) throw new Error('useUser must be used within a UserContext');
  return user;
}
