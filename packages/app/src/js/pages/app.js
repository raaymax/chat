import { h, render } from 'preact';
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components';

import store from '../state';
import { Login } from '../components/auth/login';
import { Workspace } from '../components/workspace';

const theme = {
  borderColor: '#565856',
  backgroundColor: '#1a1d21',
  highlightedBackgroundColor: '#2a2d31',
  inputBackgroundColor: '#2a2d31',
  dateBarBackgroundColor: '#2a2d31',
  fontColor: '#d9d9d9',
  frontHoverColor: 'var(--primary_active_mask)',

  linkColor: '#4a90e2',
}

export const App = () => (
  <Login>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Workspace />
      </ThemeProvider>
    </Provider>
  </Login>
)

render(<App />, document.getElementById('root'));
