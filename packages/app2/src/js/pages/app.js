/* eslint-disable no-await-in-loop */
import {h} from 'preact';
import { Provider } from 'react-redux'
import { createClientContext } from '../../core/context';
import { render } from '../utils.js';

import { Login } from '../components/auth/login';
import { Chat } from './chat/chat';

import store from '../store';

const App = () => (
  <Provider store={store}>
    <Login>
      <ClientProvider>
        <div> Ok </div>
      </ClientProvider>
    </Login>
  </Provider>
)

render(<App />, document.getElementById('root'));
