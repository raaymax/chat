import { createContext, useCallback, useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';

export type ThemeControl = {
  theme: string, 
  themeNames: string[],
  setTheme: (v: string) => void
};
export const ThemeSelectorContext = createContext<ThemeControl>({theme: 'dark', themeNames: ['dark'], setTheme: () => {}});

const themes: {[key: string]: any} = {
  dark: {
    Text: '#E0E0E0',
    Labels: '#737373',
    Strokes: '#404040',

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
      Background: '#2B2D31',
      Active: '#E0E0E0',
      Hover: '#E4E4E6',
      Inactive: '#8B8B8B',
      TextHover: 'black',
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
    Strokes: '#BFBFBF',

    SecondaryButton: {
      Hover: '#050505',
      Default: '#8D8D8D',
      Background: '#FAFAFA',
    },

    PrimaryButton: {
      Background: '#FF8C00',
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
      Background: '#F2F2F2',
      Active: '#E0E0E0',
      TextHover: 'black',
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

type ThemeSelectorContextProps = {
  children: React.ReactNode;
  defaultTheme?: string;
  value?: string;
};

export const ThemeSelectorProvider = ({ children, defaultTheme = 'dark', value }: ThemeSelectorContextProps) => {
  const savedTheme = localStorage.getItem('theme');
  const [theme, setTheme] = useState(savedTheme || defaultTheme);
  const setThemeAndSave = useCallback((theme: string) => {
    setTheme(theme);
    localStorage.setItem('theme', theme);
  }, [setTheme])

  useEffect(() => {
    if (value) {
      setThemeAndSave(value);
    }
  }, [value, setThemeAndSave]);

  document.body.setAttribute('style', `--background-color: ${themes[theme].Chatbox.Background};`);

  const currentTheme = themes[theme] ?? themes[defaultTheme];
  return (
    <ThemeSelectorContext.Provider value={{theme, setTheme: setThemeAndSave, themeNames: Object.keys(themes)}}>
      <ThemeProvider theme={currentTheme}>
        {children}
      </ThemeProvider>
    </ThemeSelectorContext.Provider>
  );
}
