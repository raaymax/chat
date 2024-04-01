import { useDispatch, useSelector } from 'react-redux';

import { Logo } from '../../atomic/atoms/Logo';
import { Channels } from '../../atomic/molecules/NavChannels';
import { UserChannels } from '../../atomic/molecules/NavUsers';
import { MainConversation } from '../organisms/MainConversaion';
import { SideConversation } from '../organisms/SideConversation';
import { Search } from '../../atomic/pages/Search';
import { Pins } from '../../atomic/pages/Pins';
import { LogoutButton } from '../../atomic/molecules/LogoutButton';
import { StreamContext } from '../../atomic/contexts/stream';
import plugins from '../../core/plugins';
import { useStream } from '../../hooks';
import styled from 'styled-components';

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

export const SideMenu = styled.div`
  flex: 0 0 200px;
  display: flex;
  flex-direction: column;
  .slider {
    flex: 1 calc(100% - 50px);
    overflow-y: auto;
  }
  .bottom {
    flex: 0 50px;
  }
  @media (max-width : 710px) {
    flex: none;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    widht: 100vw;
    height: 100vh;
    z-index: 1000;
    background-color: #1a1d21;

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
  border-left: 1px solid ${(props) => props.theme.borderColor};
  border-right: 1px solid ${(props) => props.theme.borderColor};
  &.hidden {
    flex: 0 0px;
    width: 0px;
  }
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
  const stream = useStream('main');
  const sideStream = useStream('side');
  return (
    <Container className={sideStream ? ['side-stream'] : ['main-stream']}>
      {view === 'sidebar' && <SideMenu>
        <Logo onClick={() => dispatch.actions.view.set('sidebar')} />
        <div className='slider'>
          <Channels />
          <UserChannels />
          {/* <UserList /> */}
          {plugins.get('sidebar').map((El, key) => <El key={key} />)}
        </div>
        <div className='bottom'>
          <LogoutButton size={50} />
        </div>
      </SideMenu>}
      <MainView className={view === 'sidebar' ? ['sidebar'] : []}>
        <StreamContext value={[stream, (val) => dispatch.actions.stream.open({id: 'main', value: val})]}>
          {view === 'search' && <Search />}
          {view === 'pins' && <Pins />}
          {(view === null || view === 'sidebar' || view === 'thread')
            && <MainConversation
              onClick={() => dispatch.actions.view.set('sidebar')} />
          }
        </StreamContext>
      </MainView>
      {sideStream && <SideView>
        <StreamContext value={[sideStream, (val) => dispatch.actions.stream.open({id: 'side', value: val})]}>
          <SideConversation />
        </StreamContext>
      </SideView>}
    </Container>
  );
};
