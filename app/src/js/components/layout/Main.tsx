import styled from 'styled-components';
import { 
  useActions, useSideStream, useMainStream, useDispatch,
  useUser, useSelector
} from '../../store';
import { cn, isMobile } from '../../utils';
import { StreamProvider } from '../contexts/stream';
import { useSidebar } from '../contexts/useSidebar';
import { SidebarProvider } from '../contexts/sidebar';
import { ButtonWithIcon } from '../molecules/ButtonWithIcon';
import { Logo, LogoPic } from '../atoms/Logo';
import { SizeProvider } from '../contexts/size';
import { ProfilePic } from '../atoms/ProfilePic';
import { NavChannels } from '../molecules/NavChannels';
import { NavUsers } from '../molecules/NavUsers';
import { NavButton } from '../molecules/NavButton';
import { logout } from '../../services/session';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;


  .main-view {
    #max-width: 100vw;
    background-color: ${(props) => props.theme.Chatbox.Background};
    #&.sidebar { 
    #  max-width: calc(100vw - 200px);
    #}
    flex: 1 100%;
  r .side-stream & {
      flex: 1 50%;
      @media (max-width : 710px) {
        flex: 0;
        width: 0vw;
        display: none;
      }
    }
  }

  .side-view {
    flex: 0;
    .side-stream & {
      flex: 1 50%;
      @media (max-width : 710px) {
        flex: 1 100%;
      }
    }
  }

  .workspaces {
    flex: 0 0 96px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    height: 100%;
    padding: 16px 0;
    & > *{
      margin: 0 auto;
    }
    .spacer {
      flex: 1;
    }
  }

  .side-menu {
    flex: 0 0 360px;
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

  body.mobile & {
    .side-menu {
      flex: 0 0 100vh;
      width: 100%;
    }

    &.sidebar-open .main-view {
      flex: 0 0 0px;
      width: 0px;
      overflow: hidden;
    }
  }
`;

export const Sidebar = () => {
  const { toggleSidebar } = useSidebar();
  return (
    <div className='side-menu'>
      <Logo onClick={toggleSidebar} />
      <div className='slider'>
        <NavChannels />
        <NavUsers />
      </div>
      <div className='bottom'>
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


export const SideView = ({children}: {children: React.ReactNode}) => {
  return (<div className="side-view">{children}</div>);
}

const MainView = ({children}: {children: React.ReactNode}) => {
  const dispatch = useDispatch();
  const actions = useActions();
  const stream = useMainStream();
  return (
    <div className={cn('main-view')}>
      <StreamProvider value={[stream, (val) => dispatch(actions.stream.open({ id: 'main', value: val }))]}>
        {children}
      </StreamProvider>
    </div>
  );
}

export const Desktop = ({children}: {children: React.ReactNode}) => {
  const sideStream = useSideStream();
  const { sidebar } = useSidebar();
  return (
    <Container className={cn({
      'side-stream': Boolean(sideStream),
      'main-stream': !sideStream,
      'sidebar-open': sidebar
    })}>
      <Workspaces />
      {sidebar && <Sidebar />}
      <MainView>
        {children}
      </MainView>
    </Container>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100vw;
  height: 100vh;
  background-color: ${(props) => props.theme.Navbar.Background};
  display: flex;
  flex-direction: row;
`;

export const Mobile = ({children}: {children: React.ReactNode}) => {
  const sideStream = useSideStream();
  const { sidebar } = useSidebar();
  return (
    <Container className={cn({
      'side-stream': Boolean(sideStream), 
      'main-stream': !sideStream,
      'sidebar-open': sidebar
    })}>
      {sidebar && (
        <Overlay>
          <Workspaces />
          <Sidebar />
        </Overlay>
      )}
      <MainView>
        {children}
      </MainView>
    </Container>
  );
};


export const Main = ({children}: {children: React.ReactNode}) => {
  return (
    <SidebarProvider>
      {isMobile() ? <Mobile>{children}</Mobile> : <Desktop>{children}</Desktop>}
    </SidebarProvider>
  );
}
