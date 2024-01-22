import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import '../setup';
import { client } from '../core';
import { store } from '../store';
import { Workspace } from './workspace/workspace';
import { useUser } from '../contexts/user';

const theme = {
  borderColor: '#565856',
  backgroundColor: '#1a1d21',
  highlightedBackgroundColor: '#2a2d31',
  inputBackgroundColor: '#2a2d31',
  dateBarBackgroundColor: '#2a2d31',
  fontColor: '#d9d9d9',
  frontHoverColor: 'var(--primary_active_mask)',

  userActive: '#3c7e3c',
  userConnected: '#8f8f45',
  userSystem: '#d9d9d9',
  userDisconnected: '#4f4f4f',

  actionButtonBackgroundColor: '#2E1A4E',
  actionButtonHoverBackgroundColor: '#3D2760',
  actionButtonActiveBackgroundColor: '#3D2760',
  actionButtonFontColor: '#d9d9d9',

  borderColorHover: 'white',

  searchBoxBackgroundColor: '#2a2d31',
  labelColor: 'gray',

  linkColor: '#4a90e2',
  mentionsColor: '#4ac0e2',
};

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
};

export default Secured;
