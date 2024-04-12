import {
  createContext,
} from 'react';
import { run, actions, methods} from '../storeExt';

export const ExtensionsContext = createContext({
  run,
  actions,
  methods,
});

type ExtensionsContextProps = {
  children: React.ReactNode;
};

export const ExtensionsProvider = ({ children }: ExtensionsContextProps) => {
  return (
    <ExtensionsContext.Provider value={{run, actions, methods}}>
      {children}
    </ExtensionsContext.Provider>
  );
};
