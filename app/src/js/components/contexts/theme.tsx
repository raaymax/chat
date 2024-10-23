import { createContext, useCallback, useState } from 'react';
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
  const savedTheme = localStorage.getItem('theme');
  const [theme, setTheme] = useState(savedTheme || defaultTheme);
  const setThemeAndSave = useCallback((theme: string) => {
    setTheme(theme);
    localStorage.setItem('theme', theme);
  }, [setTheme])


  const currentTheme = themes[theme] ?? themes[defaultTheme];
  return (
    <ThemeSelectorContext.Provider value={{theme, setTheme: setThemeAndSave, themeNames: Object.keys(themes)}}>
      <ThemeProvider theme={currentTheme}>
        {children}
      </ThemeProvider>
    </ThemeSelectorContext.Provider>
  );
}
