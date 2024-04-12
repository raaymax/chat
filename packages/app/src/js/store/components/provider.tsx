import { Provider } from 'react-redux';
import { ExtensionsProvider } from './extensions';
import { store } from '../store';

type ProviderProps = {
  children: React.ReactNode;
};

const StoreProvider = ({children}: ProviderProps) => (
  <Provider store={store}>
    <ExtensionsProvider>
      {children}
    </ExtensionsProvider>
  </Provider>
);

export default StoreProvider;
      
