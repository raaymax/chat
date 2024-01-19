import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { InlineChannel } from './elements/inlineChannel';

const DirectChannel = ({ channel, badge, onClick }) => {
  const me = useSelector((state) => state.me);
  let other = channel.users.find((u) => u !== me);
  if (!other) [other] = channel.users;
  const user = useSelector((state) => state.users[other]);
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

export const Channel = ({
  channelId: id, onClick, icon, badge,
}) => {
  const dispatch = useDispatch();
  const channel = useSelector((state) => state.channels[id]);
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
