/* eslint-disable no-await-in-loop */
import {h} from 'preact';
import { useDispatch, useSelector } from 'react-redux'

import styled from 'styled-components';
import { Logo } from './logo';
import { Channels } from './channels';
import { MainConversation } from './mainConversation/mainConversaion';
import { SideConversation } from './sideConversation/sideConversation';
import { Search } from './search/search';
import { Pins } from './pins/pins';
import { selectors, actions} from '../state';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  @media (max-width : 510px) {
    & .side {
      width: 100vh;
    }
    & .main {
      width: 0vh;
      display: none;
    }
  }
`;

const SideMenu = styled.div`
  flex: 0 150px;
  @media (max-width : 510px) {
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

export const Workspace = () => {
  const view = useSelector(selectors.getView);
  const thread = useSelector(selectors.getThread());
  const channelId = useSelector(selectors.getChannelId);
  const dispatch = useDispatch();
  return (
    <Container>
      {view === 'sidebar' && <SideMenu>
        <Logo onClick={() => dispatch(actions.setView('sidebar'))} />
        <Channels />
      </SideMenu>}

      {view === 'search' && <Search />}
      {view === 'pins' && <Pins />}
      {(view === null || view === 'sidebar') && <MainConversation className={view === null ? '' : 'main'} stream={{channelId}} />}
      {thread && <SideConversation className='side' stream={thread} />}
    </Container>
  )
}
