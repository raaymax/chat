import { useSelector } from 'react-redux';
import { NavButton } from './NavButton';

type NavUserButtonProps = {
  channel: {
    id: string;
    name: string;
    users: string[];
  };
  size?: number;
  badge: number;
  onClick: () => void;
};

export const NavUserButton = ({ channel, size, badge, onClick }: NavUserButtonProps) => {
  const me = useSelector((state: any) => state.me);
  let other = channel.users.find((u) => u !== me) ?? '';
  if (!other) [other] = channel.users;
  const user = useSelector((state: any) => state.users[other]);
  if (!user) {
    return ( <NavButton size={size} data-id={channel.id} onClick={onClick} icon='hash' badge={badge}>{channel.name}</NavButton> );
  }
  if (user.system) {
    return ( <NavButton size={size} data-id={channel.id} onClick={onClick} icon='system-user' badge={badge}>{user.name}</NavButton> );
  }
  const active = user.lastSeen && new Date(user.lastSeen).getTime() > Date.now() - 1000 * 60 * 5;
  return ( <NavButton size={size}
    className={`user ${user.connected ? 'connected ' : 'offline'}${active ? 'recent' : ''}${user.system ? 'system' : ''}`}
    data-id={channel.id} onClick={onClick} icon='user' badge={badge}>{user.name}</NavButton>);
};

