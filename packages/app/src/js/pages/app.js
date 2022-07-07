import {h} from 'preact';
import { Provider} from 'react-redux'

import store from '../state';
import {Chat} from './chat';

export const App = () => (
  <Provider store={store}>
    <Chat />
  </Provider>
)
