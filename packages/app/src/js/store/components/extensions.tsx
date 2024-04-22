import {
  createContext,
} from 'react';
import { actions, methods} from '../storeExt';

export const ExtensionsContext = createContext({
  actions,
  methods,
});

type ExtensionsContextProps = {
  children: React.ReactNode;
};

export const ExtensionsProvider = ({ children }: ExtensionsContextProps) => {
  return (
    <ExtensionsContext.Provider value={{actions, methods}}>
      {children}
    </ExtensionsContext.Provider>
  );
};
