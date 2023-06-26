/* eslint-disable no-await-in-loop */
import { h } from 'preact';
import { useDispatch, useSelector } from 'react-redux';

import { Logo } from '../../components/logo';
import { Channels } from '../../components/Channels/Channels';
import { UserList } from '../../components/UserList/UserList';
import { MainConversation } from '../main/mainConversaion';
import { SideConversation } from '../side/sideConversation';
import { Search } from '../../components/search/search';
import { Pins } from '../../components/pins/pins';
import { LogoutButton } from '../../components/Logout/LogoutButton';
import { StreamContext } from '../../contexts/stream';
import plugins from '../../core/plugins';
import { useStream } from '../../hooks';

import { Container } from './elements/container';
import { MainView } from './elements/mainView';
import { SideView } from './elements/sideView';
import { SideMenu } from './elements/sideMenu';

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
          <UserList />
          {plugins.get('sidebar').map((El, key) => <El key={key} />)}
        </div>
        <div className='bottom'>
          <LogoutButton />
        </div>
      </SideMenu>}
      <MainView className={view === 'sidebar' ? ['sidebar'] : []}>
        <StreamContext value={[stream, (val) => dispatch.actions.stream.open('main', val)]}>
          {view === 'search' && <Search />}
          {view === 'pins' && <Pins />}
          {(view === null || view === 'sidebar' || view === 'thread')
            && <MainConversation
              onclick={() => dispatch.actions.view.set('sidebar')} />
          }
        </StreamContext>
      </MainView>
      {sideStream && <SideView>
        <StreamContext value={[sideStream, (val) => dispatch.actions.stream.open('side', val)]}>
          <SideConversation />
        </StreamContext>
      </SideView>}
    </Container>
  );
};
