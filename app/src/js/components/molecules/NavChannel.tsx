import { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useMethods, useSelector } from '../../store';
import { Badge } from '../atoms/Badge';
import { TextWithIcon } from './TextWithIcon';
import { cn, ClassNames } from '../../utils';

const Container = styled.div`
  cursor: pointer;
  overflow: hidden;
  .text-with-icon {
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &.active {
    background-color: var(--primary_active_mask);
  }
  &:hover {
    background-color: var(--primary_active_mask);
  }
  &.system {
    color: ${(props) => props.theme.userSystem};
  }
  &.connected {
    color: ${(props) => props.theme.userConnected};
  }
  &.recent {
    color: ${(props) => props.theme.userActive};
  }
  &.offline {
    color: ${(props) => props.theme.userDisconnected};
  }
`;

type InlineChannelProps = {
  id: string;
  children: React.ReactNode;
  badge?: number;
  className?: ClassNames;
  onClick?: () => void;
  icon?: string;
};

export const InlineChannel = ({
  id, children, badge, className, onClick, icon = 'fa-solid fa-hashtag',
}: InlineChannelProps) => (
  <Container className={cn('channel', 'inline-channel', className)} data-id={id} onClick={onClick}>
    <TextWithIcon icon={icon}>{children}</TextWithIcon>
    {(badge && badge > 0) ? <Badge>{badge}</Badge> : null}
  </Container>
);

type DirectChannelProps = {
  channel: {
    id: string;
    name: string;
    users: string[];
  };
  badge?: number;
  onClick?: () => void;
  className?: ClassNames;
};

const DirectChannel = ({
  channel, badge, onClick, className,
}: DirectChannelProps) => {
  const me = useSelector((state) => state.me);
  let other = channel.users.find((u) => u !== me);
  if (!other) [other] = channel.users;
  const user = useSelector((state) => state.users[other ?? '']);
  if (!user) {
    return (
      <InlineChannel
        className={className}
        id={channel.id}
        onClick={onClick}
        badge={badge}>
        {channel.name}
      </InlineChannel>
    );
  }
  if (user.system) {
    return (
      <InlineChannel
        className={className}
        id={channel.id}
        onClick={onClick}
        icon='fa-solid fa-user-gear'
        badge={badge}>
        {user.name}
      </InlineChannel>
    );
  }
  const active = user.lastSeen && new Date(user.lastSeen).getTime() > Date.now() - 1000 * 60 * 5;
  return (<InlineChannel
    className={cn(className, 'user', {
      connected: user.connected,
      offline: !user.connected,
      recent: Boolean(active),
      system: user.system,
    })}
    id={channel.id} onClick={onClick} icon='fa-solid fa-user' badge={badge}>{user.name}</InlineChannel>);
};

type ChannelProps = {
  channelId: string;
  onClick?: () => void;
  icon?: string;
  badge?: number;
  className?: ClassNames;
};

export const Channel = ({
  channelId: id, onClick, icon, badge, className,
}: ChannelProps) => {
  const dispatch = useDispatch();
  const methods = useMethods();
  const channel = useSelector((state) => state.channels[id]);
  useEffect(() => {
    if (!channel) {
      dispatch(methods.channels.find(id));
    }
  }, [id, channel, methods, dispatch]);
  const { name, private: priv, direct } = channel || {};
  let ico = icon;
  if (priv) ico = 'fa-solid fa-lock';
  if (direct) return (<DirectChannel className={className} channel={channel || {}} onClick={onClick} badge={badge} />);
  return (
    <InlineChannel
      className={className}
      id={id}
      onClick={onClick}
      icon={ico}
      badge={badge}
    >
      {name}
    </InlineChannel>
  );
};

export const NavChannel = Channel;
