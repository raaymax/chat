import { useDispatch, useSelector } from 'react-redux';

import { MainConversation } from '../organisms/MainConversaion';
import { SideConversation } from '../organisms/SideConversation';
import { Search } from '../pages/Search';
import { Pins } from '../pages/Pins';
import { StreamProvider } from '../contexts/stream';
import { useStream } from '../../hooks';
import styled from 'styled-components';
import { Sidebar } from '../organisms/Sidebar';
import { cn } from '../../utils';

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
  const view = useSelector((state: any) => state.view?.current);
  const dispatch: any = useDispatch();
  const stream = useStream('main');
  const sideStream = useStream('side');
  return (
    <Container className={cn({'side-stream': sideStream, 'main-stream': !sideStream })}>
      {view === 'sidebar' && <Sidebar />}
      <MainView className={cn({sidebar: view === 'sidebar'})}>
        <StreamProvider value={[stream, (val) => dispatch.actions.stream.open({id: 'main', value: val})]}>
          {view === 'search' && <Search />}
          {view === 'pins' && <Pins />}
          {(view === null || view === 'sidebar' || view === 'thread')
            && <MainConversation
              onClick={() => dispatch.actions.view.set('sidebar')} />
          }
        </StreamProvider>
      </MainView>
      {sideStream && <SideView>
        <StreamProvider value={[sideStream, (val) => dispatch.actions.stream.open({id: 'side', value: val})]}>
          <SideConversation />
        </StreamProvider>
      </SideView>}
    </Container>
  );
};
