import styled from 'styled-components';
import { Outlet } from "react-router-dom";
import { 
  useActions, useSideStream, useMainStream, useDispatch,
} from '../../store';
import { Sidebar } from '../organisms/Sidebar';
import { cn } from '../../utils';
import { StreamProvider } from '../contexts/stream';
import { useSidebar } from '../contexts/useSidebar';
import { SidebarProvider } from '../contexts/sidebar';

export const MainViewContainer = styled.div`
  max-width: 100vw;
  &.sidebar { 
    max-width: calc(100vw - 200px);
  }
  flex: 1 100%;
  .side-stream & {
    flex: 1 50%;
    @media (max-width : 710px) {
      flex: 0;
      width: 0vw;
      display: none;
    }
  }
`;

const MainView = ({children}: {children: React.ReactNode}) => {
  const { sidebar } = useSidebar();
  const dispatch = useDispatch();
  const actions = useActions();
  const stream = useMainStream();
  return (
    <MainViewContainer className={cn({ sidebar })}>
      <StreamProvider value={[stream, (val) => dispatch(actions.stream.open({ id: 'main', value: val }))]}>
        {children}
      </StreamProvider>
    </MainViewContainer>
  );
}

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
`;

export const SideView = styled.div`
  flex: 0;
  .side-stream & {
    flex: 1 50%;
    @media (max-width : 710px) {
      flex: 1 100%;
    }
  }
`;

export const Main = ({children}: {children: React.ReactNode}) => {
  const sideStream = useSideStream();
  return (
    <Container className={cn({ 'side-stream': Boolean(sideStream), 'main-stream': !sideStream })}>
      <SidebarProvider>
        <Sidebar />
        <MainView>
          {children}
        </MainView>
      </SidebarProvider>
    </Container>
  );
};
