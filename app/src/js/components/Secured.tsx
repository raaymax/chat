import { useEffect } from 'react';
import '../setup';
import { client } from '../core';
import StoreProvider from '../store/components/provider';
import { useUser } from './contexts/useUser';
import { Router } from './Router';
import { ThemeSelectorProvider } from './contexts/theme';

const themes = {
  dark: {
    Text: '#E0E0E0',
    Labels: '#737373',
    Strokes: '#737373',

    SecondaryButton: {
      Hover: '#E0E0E0',
      Default: '#737373',
      Background: '#313338',
    },

    PrimaryButton: {
      Background: '#9747FF',
      Text: '#FAFAFA',
    },

    Navbar: {
      Background: '#1E1F22',
      Icons: '#E0E0E0',
    },

    Channels: {
      Container: '#2B2D31',
    },

    Input: {
      Background: '#2B2D31',
    },

    Chatbox: {
      Background: '#313338',
      Selected: '#2B2D31', // added by me

      Message: {
        Hover: '#2B2D31',
        ProgressDone: '#262626',
        ReactionButton: '#1E1F22',
      },
    },

    ToggleButton: {
      Default: '#8D8D8D',
      Hover: '#FFFFFF',
    },

    Channel: {
      Active: '#E0E0E0',
      Hover: '#E4E4E6',
      Inactive: '#8B8B8B',
    },

    User: {
      Active: '#40BE44',
      Inactive: '#EC0A0E',
      AFK: '#FFB26F',
    },

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
  },
  light: {
    Text: '#050505',
    Labels: '#8D8D8D',
    Strokes: '#8D8D8D',

    SecondaryButton: {
      Hover: '#050505',
      Default: '#8D8D8D',
      Background: '#FAFAFA',
    },

    PrimaryButton: {
      Background: '#9747FF',
      Text: '#FAFAFA',
    },

    Navbar: {
      Background: '#E5E4E6',
      Icons: '#050505',
    },

    Channels: {
      Container: '#F2F2F2',
    },

    Input: {
      Background: '#EEEDF0',
    },

    Chatbox: {
      Background: '#FAFAFA',
      Selected: '#2B2D31', // added by me

      Message: {
        Hover: '#F2F2F2',
        ProgressDone: '#D9D9D9',
        ReactionButton: '#E5E4E6',
      },
    },

    ToggleButton: {
      Default: '#8D8D8D',
      Hover: '#000000',
    },

    Channel: {
      Active: '#E0E0E0',
      Hover: '#E4E4E6',
      Inactive: '#8B8B8B',
    },

    User: {
      Active: '#40BE44',
      Inactive: '#EC0A0E',
      AFK: '#FFB26F',
    },

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
  }
};

const Secured = () => {
  const user = useUser();
  useEffect(() => {
    client.emit('auth:user', user);
  }, [user]);

  return (
    <StoreProvider>
      <ThemeSelectorProvider themes={themes} defaultTheme='dark'>
        <Router />
      </ThemeSelectorProvider>
    </StoreProvider>
  );
};

export default Secured;
