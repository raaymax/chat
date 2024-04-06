import styled from 'styled-components';
import { Logo } from '../atoms/Logo';
import { NavChannels } from '../molecules/NavChannels';
import { NavUsers } from '../molecules/NavUsers';
import { NavButton } from '../molecules/NavButton';
import plugins from '../../core/plugins';
import { logout } from '../../services/session';
import { useDispatch } from 'react-redux';


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

export const Sidebar = () => {
  const dispatch: any = useDispatch();
  return (
    <SideMenu>
      <Logo onClick={() => dispatch.actions.view.set('sidebar')} />
      <div className='slider'>
        <NavChannels />
        <NavUsers />
        {/* <UserList /> */}
        {plugins.get('sidebar').map((El, key) => <El key={key} />)}
      </div>
      <div className='bottom'>
        <NavButton icon="logout" size={50} onClick={() => dispatch(logout())}>Logout</NavButton>
      </div>
    </SideMenu>
  );
}
