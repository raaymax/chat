import { useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import '../setup';
import {
  createHashRouter,
  RouterProvider,
} from 'react-router-dom';
import { client } from '../core';
import StoreProvider from '../store/components/provider';
import { useUser } from './contexts/useUser';
<<<<<<< HEAD
import { Router } from './Router';
=======
>>>>>>> v3.0

const theme = {
  ToggleButton: {
    Default: '#737373',
    Hover: '#E0E0E0',
  },
  Channels: {
    Container: '#2B2D31',
  },
  Chatbox: {
    Background: '#313338',
  },
  Input: {
    Background: '#2B2D31',
  },

  Labels: '#737373',
  Strokes: '#737373',
  Text: '#E0E0E0',
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

  buttonHoverBackground: '#3D2760',
  buttonActiveBackground: '#3D2760',

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

<<<<<<< HEAD
=======
  const router = createHashRouter([
    {
      path: '/*',
      element: <Workspace />,
    },
  ]);
>>>>>>> v3.0
  return (
    <StoreProvider>
      <ThemeProvider theme={theme}>
        <Router />
      </ThemeProvider>
    </StoreProvider>
  );
};

export default Secured;
