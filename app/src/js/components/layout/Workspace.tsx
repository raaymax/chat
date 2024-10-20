import styled from 'styled-components';
import {
  useActions, useSelector, useSideStream, useMainStream, useDispatch,
} from '../../store';

import { MainConversation } from './MainConversaion';
import { SideConversation } from './SideConversation';
import { Search } from './Search';
import { Pins } from './Pins';
import { StreamProvider } from '../contexts/stream';
import { Sidebar } from '../organisms/Sidebar';
import { cn } from '../../utils';
import { SidebarProvider } from '../contexts/sidebar';

export const MainView = styled.div`
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

export const Container = styled.div`
  display: flex;
  background-color: ${(props) => props.theme.Chatbox.Background};
  color: ${(props) => props.theme.Text};
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

export const Workspace = () => {
  const view = useSelector((state) => state.view?.current);
  const dispatch = useDispatch();
  const actions = useActions();
  const stream = useMainStream();
  const sideStream = useSideStream();
  return (
    <SidebarProvider>
    <Container className={cn({ 'side-stream': Boolean(sideStream), 'main-stream': !sideStream })}>
      <Sidebar />
      <MainView className={cn({ sidebar: view === 'sidebar' })}>
        <StreamProvider value={[stream, (val) => dispatch(actions.stream.open({ id: 'main', value: val }))]}>
          {(view === null || view === 'sidebar' || view === 'thread')
            && <MainConversation
              onClick={() => dispatch(actions.view.set('sidebar'))} />
          }
        </StreamProvider>
      </MainView>
      {sideStream && <SideView>
        <StreamProvider value={[sideStream, (val) => dispatch(actions.stream.open({ id: 'side', value: val }))]}>
          <SideConversation />
        </StreamProvider>
      </SideView>}
    </Container>
    </SidebarProvider>
  );
};


