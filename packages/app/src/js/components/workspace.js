/* eslint-disable no-await-in-loop */
import {h} from 'preact';
import { useDispatch, useSelector } from 'react-redux'

import styled from 'styled-components';
import { useEffect } from 'preact/hooks';
import { Logo } from './logo';
import { Channels } from './channels';
import { MainConversation } from './messages/main/mainConversaion';
import { SideConversation } from './messages/side/sideConversation';
import { Search } from './search/search';
import { Pins } from './pins/pins';
import { selectors, actions, useStream} from '../state';
import {StreamContext} from './streamContext';
import { setStream } from '../services/stream';

const SideView = styled.div`
  flex: 0;
  .side-stream & {
    flex: 1 50%;
    @media (max-width : 710px) {
      flex: 1 100%;
    }
  }
`;

const MainView = styled.div`
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
`

const SideMenu = styled.div`
  flex: 0 0 200px;
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
  }
  border-left: 1px solid ${(props) => props.theme.borderColor};
  border-right: 1px solid ${(props) => props.theme.borderColor};
  &.hidden {
    flex: 0 0px;
    width: 0px;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: 100vh;

`;

export const Workspace = () => {
  const view = useSelector(selectors.getView);
  const channelId = useSelector(selectors.getChannelId);
  const dispatch = useDispatch();
  const stream = useStream('main');
  const sideStream = useStream('side');

  useEffect(() => {
    dispatch(setStream('main', {type: 'live', channelId}));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId]);

  return (
    <Container className={sideStream ? ['side-stream'] : ['main-stream']}>
      {view === 'sidebar' && <SideMenu>
        <Logo onClick={() => dispatch(actions.setView('sidebar'))} />
        <Channels />
      </SideMenu>}
      <MainView className={view === 'sidebar' ? ['sidebar'] : []}>
        <StreamContext value={[stream, (val) => dispatch(setStream('main', val))]}>
          {view === 'search' && <Search />}
          {view === 'pins' && <Pins />}
          {(view === null || view === 'sidebar' || view === 'thread')
            && <MainConversation
              onclick={() => dispatch(actions.setView('sidebar'))} />
          }
        </StreamContext>
      </MainView>
      {sideStream && <SideView>
        <StreamContext value={[sideStream, (val) => dispatch(setStream('side', val))]}>
          <SideConversation />
        </StreamContext>
      </SideView>}
    </Container>
  )
}
