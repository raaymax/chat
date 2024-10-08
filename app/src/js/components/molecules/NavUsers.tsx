import styled from 'styled-components';
import {
    useActions,
  useBadges,
  useSelector,
  useUsers,
} from '../../store';
import { NavButton } from './NavButton';
import { ClassNames, cn } from '../../utils';
import { client } from '../../core';
import { useDispatch } from 'react-redux';
import { Progress, User } from '../../types';
import { useDirectChannel } from '../contexts/useDirectChannel';

type NavUserButtonProps = {
  user: {
    id: string;
    name: string;
    system?: boolean;
    connected?: boolean;
    lastSeen?: string;
  };
  size?: number;
  badge: number;
  className?: ClassNames;
  onClick: () => void;
};

export const NavUserButton = ({
  user, size, badge, className, onClick,
}: NavUserButtonProps) => {
  if (user.system) {
    return (<NavButton className={className} size={size} data-id={user.id} onClick={onClick} icon='system-user' badge={badge}>{user.name}</NavButton>);
  }
  const active = user.lastSeen && new Date(user.lastSeen).getTime() > Date.now() - 1000 * 60 * 5;
  return (<NavButton size={size}
    className={cn('user', {
      connected: user.connected ?? false,
      offline: !user.connected,
      recent: Boolean(active),
      system: user.system ?? false,
    }, className)}
    data-id={user.id} onClick={onClick} icon='user' badge={badge}>{user.name}</NavButton>);
};
const ChannelsContainer = styled.div`
  .header {
    display: flex;
    flex-direction: row;
    padding: 5px 10px;
    padding-top: 20px;
    font-weight: bold;
    .title {
      flex: 1;
    }

    i {
      cursor: pointer;
      flex: 0 15px;
      font-size: 19px;
    }

  }

  .user {
    padding: 5px 5px 5px 20px; 
    cursor: pointer;
  }
  .user .name {
    padding: 0px 10px; 
    cursor: pointer;
  }
  .user.active {
    background-color: var(--primary_active_mask);
  }

  .user:hover {
    background-color: var(--primary_active_mask);
  }
`;


const NavUserContainer = ({user, badges}: {user: User, badges: Record<string, number>}) => {
  const actions = useActions();
  const dispatch = useDispatch();
  const channel = useDirectChannel(user.id);
  const id = useSelector((state) => state.stream.main.channelId);
  return <NavUserButton
    size={30}
    user={user}
    className={{ active: id === channel?.id }}
    badge={channel ? badges[channel.id] : 0}
    onClick={async () => {
      const channel = await client.api.putDirectChannel(user.id);
      console.log('channel', channel);
      dispatch(actions.stream.open({ id: 'main', value: { type: 'live', channelId: channel.id } }));
      dispatch(actions.view.set(null));
    }}
  />
}

export const NavUsers = () => {
  const users = useUsers();
  const userId = useSelector((state) => state.me);
  const badges = useBadges(userId);
  return (
    <ChannelsContainer>
      <div className='header'>
        <span className='title'>users</span>
      </div>
      { users && users.map((user) => (
        <NavUserContainer
          key={user.id}
          user={user}
          badges={badges}
          />
      ))}
    </ChannelsContainer>
  );
};
