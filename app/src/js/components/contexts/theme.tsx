import { createContext, useState } from 'react';
import { ThemeProvider } from 'styled-components';

export type ThemeControl = {
  theme: string, 
  themeNames: string[],
  setTheme: (v: string) => void
};
export const ThemeSelectorContext = createContext<ThemeControl>({theme: 'dark', themeNames: ['dark'], setTheme: () => {}});

type Themes = {
  [name: string]: any;
}
type ThemeSelectorContextProps = {
  children: React.ReactNode;
  themes: Themes;
  defaultTheme?: string;
};

export const ThemeSelectorProvider = ({ children, themes, defaultTheme = 'dark' }: ThemeSelectorContextProps) => {
  const [theme, setTheme] = useState(defaultTheme);

  const currentTheme = themes[theme];
  return (
    <ThemeSelectorContext.Provider value={{theme, setTheme, themeNames: Object.keys(themes)}}>
      <ThemeProvider theme={currentTheme}>
        {children}
      </ThemeProvider>
    </ThemeSelectorContext.Provider>
  );
}
