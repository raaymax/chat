import styled, { useTheme } from 'styled-components';
import { useSelector } from '../../store';
import { cn, isMobile } from '../../utils';
import { useSidebar } from '../contexts/useSidebar';
import { SidebarProvider } from '../contexts/sidebar';
import { ButtonWithIcon } from '../molecules/ButtonWithIcon';
import { LogoPic } from '../atoms/Logo';
import { Resizer } from '../atoms/Resizer';
import { SizeProvider } from '../contexts/size';
import { ProfilePic } from '../atoms/ProfilePic';
import { NavChannels } from '../molecules/NavChannels';
import { NavUsers } from '../molecules/NavUsers';
import { NavButton } from '../molecules/NavButton';
import { logout } from '../../services/session';
import { useParams } from 'react-router-dom';
import { useThemeControl } from '../contexts/useThemeControl';
import { useCallback, useEffect, useMemo, useState } from 'react';

const WORKSPACES_WIDTH = 80;
const RESIZER_WIDTH = 8;

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  color: ${(props) => props.theme.Text};
  --topbar-height: 64px;


  .resizer {
    position: relative;
    flex: 0 0 ${RESIZER_WIDTH}px;
    cursor: ew-resize;
    background-color: ${(props) => props.theme.Channels.Container};
    border-right: 0;
    &:hover {
      border-right: 1px solid ${(props) => props.theme.PrimaryButton.Background};
    }
    &.dragging {
      border-right: 3px solid ${(props) => props.theme.PrimaryButton.Background};
    }
    &:after {
      position: absolute;
      top: 0;
      right: 0;
      width: 100%;
      content: '';
      display: block;
      height: var(--topbar-height);
      border-bottom: 1px solid ${(props) => props.theme.Strokes};
    }
  }

  .main-view {
    background-color: ${(props) => props.theme.Chatbox.Background};
    flex: 1 100%;
  }

  .workspaces {
    flex: 0 0 ${WORKSPACES_WIDTH}px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    height: 100%;
    padding: 16px 0;
    background-color: ${(props) => props.theme.Navbar.Background};
    & > *{
      margin: 0 auto;
    }
    .spacer {
      flex: 1;
    }
  }
  .side-menu-header {
    flex: 0 0 64px;
    height: 64px;
    border-bottom: 1px solid ${(props) => props.theme.Strokes};
    padding: 16px 24px;
    font-size: 24px;
  }

  .side-menu {
    flex: 0 0 356px;
    display: flex;
    background-color: ${(props) => props.theme.Channels.Container};
    flex-direction: column;
  

    .slider {
      flex: 1 calc(100% - 50px);
      overflow-y: auto;
    }
    .bottom {
      flex: 0 50px;
    }
    @media (max-width : 710px) {
      width: 100%;
      height: 100vh;

      & .channel {
        height: 40px;
        line-height: 40px;
        vertical-align: middle;
        font-size: 20px;
        & .name {
        height: 40px;
          line-height: 40px;
          vertical-align: middle;
          font-size: 20px;
        }
      }
      & .user{
        height: 40px;
        line-height: 40px;
        vertical-align: middle;
        font-size: 20px;
        & .name {
        height: 40px;
          line-height: 40px;
          vertical-align: middle;
          font-size: 20px;
        }
      }
    }
    &.hidden {
      flex: 0 0px;
      width: 0px;
    }

  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 100vw;
    height: 100vh;
    background-color: ${(props) => props.theme.Navbar.Background};
    display: flex;
    flex-direction: row;
  }

  body.mobile & {
    .main-view {
      flex: 1 100vh;
      width: 100vh;
      max-width: 100vh;
    }
    .side-menu {
      flex: 1 100vh;
      width: 100%;
    }

    &.sidebar-open .main-view {
      flex: 0 0 0px;
      width: 0px;
      overflow: hidden;
    }
  }
`;


export const Sidebar = ({style}: {style?: {[key: string]: string}}) => {
  const themeControl = useThemeControl();
  const otherTheme = themeControl.themeNames.find((name) => name !== themeControl.theme);
  return (
    <div className='side-menu' style={style}>
      <div className='side-menu-header'>
        Workspace
      </div>
      <div className='slider'>
        <NavChannels />
        <NavUsers />
      </div>
      <div className='bottom'>
        <NavButton icon="star" size={50} onClick={() => {if(otherTheme) themeControl.setTheme(otherTheme)}}>Theme</NavButton>
        <NavButton icon="logout" size={50} onClick={() => logout()}>Logout</NavButton>
      </div>
    </div>
  );
};

export const Workspaces = () => {
  const userId = useSelector((state) => state?.me);
  return (
    <div className="workspaces">
      <SizeProvider value={64}>
        <LogoPic onClick={() => {}}/>
        <ButtonWithIcon icon="bars"/>
        <div className="spacer" />
        {userId && <ProfilePic type='regular' userId={userId}/> }
      </SizeProvider>
    </div>
  );
}

export const Desktop = ({children}: {children: React.ReactNode}) => {
  const { sidebar } = useSidebar();
  const { parentId } = useParams();
  const [size, setSize] = useState(Number(localStorage.getItem('sidebar-size')) || 356);
  const theme = useTheme();
  useEffect(() => {
    document.querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme.Navbar.Background);
  }, [theme]);
  console.log(size, WORKSPACES_WIDTH, RESIZER_WIDTH)
  const sideSize = useMemo(() => {
    if (!sidebar) return WORKSPACES_WIDTH;
    return size + WORKSPACES_WIDTH + RESIZER_WIDTH;
  }, [size, sidebar]);
  return (
    <Container className={cn({
      'side-stream': Boolean(parentId),
      'sidebar-open': sidebar,
      'sidebar-closed': !sidebar
    })}>
      <Workspaces />
      {sidebar && <Sidebar style={{flex: `0 0 ${size}px`, maxWidth: `${size}px`}} />}
      {sidebar && <Resizer value={size} onChange={setSize} /> }
      <div className={cn('main-view')} style={{
        flex: `0 1 calc(100vw - ${sideSize}px)`,
        maxWidth: `calc(100vw - ${sideSize}px)`
      }}>
        {children}
      </div>
    </Container>
  );
};

export const Mobile = ({children}: {children: React.ReactNode}) => {
  const { sidebar } = useSidebar();
  const { parentId } = useParams();
  const theme = useTheme();
  useEffect(() => {
    document.querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', sidebar ? theme.Navbar.Background : theme.Chatbox.Background);
  }, [sidebar, theme]);
  return (
    <Container className={cn({
      'side-stream': Boolean(parentId),
      'sidebar-open': sidebar,
      'sidebar-closed': !sidebar
    })}>
      {sidebar && (
        <div className='overlay'>
          <Workspaces />
          <Sidebar />
        </div>
      )}
      <div className={cn('main-view')}>
        {children}
      </div>
    </Container>
  );
};

export const Main = ({children}: {children: React.ReactNode}) => {
  return (
    <SidebarProvider>
      {isMobile() 
        ? <Mobile>{children}</Mobile>
        : <Desktop>{children}</Desktop>}
    </SidebarProvider>
  );
}
