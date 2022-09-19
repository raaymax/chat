import { h, render } from 'preact';
import { Provider } from 'react-redux'

import store from '../state';
import { Login } from '../components/auth/login';
import { Workspace } from '../components/workspace';

export const App = () => (
  <Login>
    <Provider store={store}>
      <Workspace />
    </Provider>
  </Login>
)

render(<App />, document.getElementById('root'));
