import { Provider } from 'react-redux';
import { store } from '../store';

type ProviderProps = {
  children: React.ReactNode;
};

const StoreProvider = ({children}: ProviderProps) => (
  <Provider store={store}>
    {children}
  </Provider>
);

export default StoreProvider;
      
