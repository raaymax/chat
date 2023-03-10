import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components';
import '../setup';
import { client } from '../core';
import store from '../state';
import { Workspace } from '../components/workspace';
import { useUser } from '../components/auth/UserContext';

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

console.log(store.getState());

const Secured = () => {
  const user = useUser();
  useEffect(() => {
    client.emit('auth:user', user);
  }, [user]);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Workspace />
      </ThemeProvider>
    </Provider>
  );
}

export default Secured;
