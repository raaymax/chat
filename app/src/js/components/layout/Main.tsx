import styled, { useTheme } from 'styled-components';
import { useSelector } from '../../store';
import { cn, isMobile } from '../../utils';
import { useSidebar } from '../contexts/useSidebar';
import { SidebarProvider } from '../contexts/sidebar';
import { ButtonWithIcon } from '../molecules/ButtonWithIcon';
import { LogoPic } from '../atoms/Logo';
import { SizeProvider } from '../contexts/size';
import { ProfilePic } from '../atoms/ProfilePic';
import { NavChannels } from '../molecules/NavChannels';
import { NavUsers } from '../molecules/NavUsers';
import { NavButton } from '../molecules/NavButton';
import { logout } from '../../services/session';
import { useParams } from 'react-router-dom';
import { useThemeControl } from '../contexts/useThemeControl';
import { useCallback, useEffect, useState } from 'react';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  color: ${(props) => props.theme.Text};
  --topbar-height: 64px;


  .resizer {
    flex: 0 0 8px;
    cursor: ew-resize;
    background-color: ${(props) => props.theme.Channels.Container};
    border-right: 1px solid ${(props) => props.theme.Strokes};
    &:hover {
      border-right: 3px solid ${(props) => props.theme.PrimaryButton.Background};
    }
    &.dragging {
      background-color: ${(props) => props.theme.PrimaryButton.Background};
    }
    &:after {
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
    flex: 0 0 80px;
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

export const Sidebar = ({style}) => {
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

export const Resizer = ({value, onChange}: {value: number, onChange: (v: number ) => void}) => {
  const [prevPos, setPrevPos] = useState<number | null>(null);
  const [dragging, setDragging] = useState<boolean>(false);
  const startDrag = useCallback((e: React.DragEvent) => {
    setDragging(true);
    const img = document.getElementById('void') as HTMLImageElement;
    e.dataTransfer.setDragImage(img, 0, 0);
  }, [setDragging]);
  const endDrag = useCallback(() => {
    console.log('end')
    setDragging(false);
    setPrevPos(null);
  }, [setDragging, setPrevPos]);
  const resize = useCallback((e: React.DragEvent) => {
    if (e.clientX === 0) return;
    if (prevPos === null) return setPrevPos(e.clientX);
    const deltaX = e.clientX - prevPos;
    const newSize = Math.max(150, Math.min(500, value + deltaX));
    onChange(newSize);
    localStorage.setItem('sidebar-size', `${newSize}`);
    setPrevPos(e.clientX);
  }, [value, onChange, prevPos, setPrevPos]);

  return (
    <div className={cn('resizer', {dragging})} onDragStart={startDrag} onDragEnd={endDrag} onDrag={resize} draggable={true}>
      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/ckM3ZIAAAAASUVORK5CYII=" id="void"/>
    </div>
  )
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
    
  return (
    <Container className={cn({
      'side-stream': Boolean(parentId),
      'sidebar-open': sidebar,
      'sidebar-closed': !sidebar
    })}>
      <Workspaces />
      {sidebar && <Sidebar style={{flex: `0 0 ${size}px`}} />}
      <Resizer value={size} onChange={setSize} />
      <div className={cn('main-view')}>
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
