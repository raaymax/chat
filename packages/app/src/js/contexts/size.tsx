import { useContext, createContext } from 'react';

const Context = createContext<number | undefined>();

type SizeContextProps = {
  value?: number;
  children: React.ReactNode;
};

export const SizeContext = ({ children, value }: SizeContextProps) => (
  <Context.Provider value={value}>
    {children}
  </Context.Provider>
);

export const useSize = (size?: number) => { 
  return size ?? useContext(Context);
}
