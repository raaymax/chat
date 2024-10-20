import styled from 'styled-components';
import { Logo } from '../atoms/Logo';
import { NavChannels } from '../molecules/NavChannels';
import { NavUsers } from '../molecules/NavUsers';
import { NavButton } from '../molecules/NavButton';
import plugins from '../../core/plugins';
import { logout } from '../../services/session';
import { useActions, useDispatch } from '../../store';
import { useSidebar } from '../contexts/useSidebar';

export const SideMenu = styled.div`
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
`;

export const Sidebar = () => {
  const dispatch = useDispatch();
  const actions = useActions();
  const { toggleSidebar } = useSidebar();
  return (
    <SideMenu>
      <Logo onClick={toggleSidebar} />
      <div className='slider'>
        <NavChannels />
        <NavUsers />
        {/* <UserList /> */}
        {plugins.get('sidebar').map((El: React.FC, key: string) => <El key={key} />)}
      </div>
      <div className='bottom'>
        <NavButton icon="logout" size={50} onClick={() => logout()}>Logout</NavButton>
      </div>
    </SideMenu>
  );
};
