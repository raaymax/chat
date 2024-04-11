import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../store';
import styled from 'styled-components';
import { Badge } from '../atoms/Badge';
import { TextWithIcon } from './TextWithIcon';
import { cn, ClassNames } from '../../utils';

const Container = styled.div`
  cursor: pointer;
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
  children: any;
  badge?: number;
  className?: ClassNames;
  onClick?: () => void;
  icon?: string;
};

export const InlineChannel = ({
  id, children, badge, className, onClick, icon = 'fa-solid fa-hashtag',
}: InlineChannelProps) => (
  <Container className={cn('channel', className)} data-id={id} onClick={onClick}>
    <TextWithIcon icon={icon}>{children}</TextWithIcon> 
    {(badge && badge > 0) ? <Badge>{badge}</Badge> : null}
  </Container>
)

type DirectChannelProps = {
  channel: {
    id: string;
    name: string;
    users: string[];
  };
  badge?: number;
  onClick?: () => void;
};

const DirectChannel = ({ channel, badge, onClick }: DirectChannelProps) => {
  const me = useSelector((state: any) => state.me);
  let other = channel.users.find((u) => u !== me);
  if (!other) [other] = channel.users;
  const user = useSelector((state: any) => state.users[other ?? '']);
  if (!user) {
    return ( <InlineChannel id={channel.id} onClick={onClick} badge={badge}>{channel.name}</InlineChannel> );
  }
  if (user.system) {
    return ( <InlineChannel id={channel.id} onClick={onClick} icon='fa-solid fa-user-gear' badge={badge}>{user.name}</InlineChannel> );
  }
  const active = user.lastSeen && new Date(user.lastSeen).getTime() > Date.now() - 1000 * 60 * 5;
  return ( <InlineChannel
    className={`user ${user.connected ? 'connected ' : 'offline'}${active ? 'recent' : ''}${user.system ? 'system' : ''}`}
    id={channel.id} onClick={onClick} icon='fa-solid fa-user' badge={badge}>{user.name}</InlineChannel>);
};

type ChannelProps = {
  channelId: string;
  onClick?: () => void;
  icon?: string;
  badge?: number;
};

export const Channel = ({
  channelId: id, onClick, icon, badge,
}: ChannelProps) => {
  const dispatch: any = useDispatch();
  const channel = useSelector((state: any) => state.channels[id]);
  useEffect(() => {
    if (!channel) {
      dispatch.methods.channels.find(id);
    }
  }, [id, channel, dispatch]);
  const { name, private: priv, direct } = channel || {};
  let ico = icon;
  if (priv) ico = 'fa-solid fa-lock';
  if (direct) return ( <DirectChannel channel={channel || {}} onClick={onClick} badge={badge} /> );
  return ( <InlineChannel id={id} onClick={onClick} icon={ico} badge={badge}>{name}</InlineChannel> );
};

