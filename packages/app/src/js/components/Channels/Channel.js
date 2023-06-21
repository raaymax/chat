import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { selectors } from '../../state';
import { InlineChannel } from './elements/inlineChannel';

const DirectChannel = ({ channel, badge, onClick }) => {
  const me = useSelector(selectors.getMeId);
  let other = channel.users.find((u) => u !== me);
  if (!other) [other] = channel.users;
  const user = useSelector(selectors.getUser(other));
  if (!user) {
    return ( <InlineChannel id={channel.id} onClick={onClick} badge={badge}>{channel.name}</InlineChannel> );
  }
  if (user.system) {
    return ( <InlineChannel id={channel.id} onClick={onClick} icon='fa-solid fa-user-gear' badge={badge}>{user.name}</InlineChannel> );
  }
  return ( <InlineChannel id={channel.id} onClick={onClick} icon='fa-solid fa-user' badge={badge}>{user.name}</InlineChannel> );
};

export const Channel = ({
  channelId: id, onclick, icon, badge,
}) => {
  const dispatch = useDispatch();
  const channel = useSelector(selectors.getChannel({ id }));
  useEffect(() => {
    if (!channel) {
      dispatch.methods.channels.find(id);
    }
  }, [id, channel, dispatch]);
  const { name, private: priv, direct } = channel || {};
  let ico = icon;
  if (priv) ico = 'fa-solid fa-lock';
  if (direct) return ( <DirectChannel channel={channel || {}} onClick={onclick} badge={badge} /> );
  return ( <InlineChannel id={id} onClick={onclick} icon={ico} badge={badge}>{name}</InlineChannel> );
};
