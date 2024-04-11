import {
  createContext,
} from 'react';

export const CommandContext = createContext(undefined);

type CommandContextProps = {
  children: React.ReactNode;
  value: any;
};

export const CommandProvider = ({ children, value }: CommandContextProps) => {
  return (
    <CommandContext.Provider value={value}>
      {children}
    </CommandContext.Provider>
  );
};
