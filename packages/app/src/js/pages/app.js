import { h, render } from 'preact';
import { Provider } from 'react-redux'

import store from '../state';
import { Login } from '../components/auth/login';
import { Chat } from './chat';

export const App = () => (
  <Login>
    <Provider store={store}>
      <Chat />
    </Provider>
  </Login>
)

render(<App />, document.getElementById('root'));
