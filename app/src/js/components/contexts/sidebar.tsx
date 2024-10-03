import {
  useState, createContext,
} from 'react';

export type SidebarContextType = {
  sidebar: boolean;
  showSidebar: () => void;
  hideSidebar: () => void;
  toggleSidebar: () => void;
};

export const SidebarContext = createContext<SidebarContextType>({
  sidebar: true,
  showSidebar: () => {},
  hideSidebar: () => {},
  toggleSidebar: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const SidebarProvider = ({children}: Props) => {
  const [sidebar, setSidebar]= useState<boolean>(false);
  const api = {
    sidebar,
    showSidebar: () => setSidebar(true),
    hideSidebar: () => setSidebar(false),
    toggleSidebar: () => setSidebar(!sidebar)
  }
  return (
    <SidebarContext.Provider value={api}>
      {children}
    </SidebarContext.Provider>
  );
};
