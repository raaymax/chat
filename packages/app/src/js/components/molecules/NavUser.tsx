import { useSelector } from '../../store';
import { NavButton } from './NavButton';
import { ClassNames, cn } from '../../utils';

type NavUserButtonProps = {
  channel: {
    id: string;
    name: string;
    users: string[];
  };
  size?: number;
  badge: number;
  className?: ClassNames;
  onClick: () => void;
};

export const NavUserButton = ({ channel, size, badge, className, onClick }: NavUserButtonProps) => {
  const me = useSelector((state) => state.me);
  let other = channel.users.find((u) => u !== me) ?? '';
  if (!other) [other] = channel.users;
  const user = useSelector((state) => state.users[other]);
  if (!user) {
    return ( <NavButton className={className} size={size} data-id={channel.id} onClick={onClick} icon='hash' badge={badge}>{channel.name}</NavButton> );
  }
  if (user.system) {
    return ( <NavButton className={className} size={size} data-id={channel.id} onClick={onClick} icon='system-user' badge={badge}>{user.name}</NavButton> );
  }
  const active = user.lastSeen && new Date(user.lastSeen).getTime() > Date.now() - 1000 * 60 * 5;
  return ( <NavButton size={size}
    className={cn('user', {
      connected: user.connected,
      offline: !user.connected,
      recent: Boolean(active),
      system: user.system
    }, className)}
    data-id={channel.id} onClick={onClick} icon='user' badge={badge}>{user.name}</NavButton>);
};

