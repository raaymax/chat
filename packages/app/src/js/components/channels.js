import { h} from 'preact';
import { useEffect } from 'preact/hooks';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { openChannel, findChannel } from '../services/channels';
import { selectors } from '../state';
import { ChannelCreate } from './ChannelCreate/ChannelCreate';

const Badge = styled.span`
  border-radius: 10px;
  background-color: #af0000;
  color: #ffffff;
  font-size: 0.8em;
  padding: 3px 5px;
`;

export const Channel = ({channelId: id, onclick, icon }) => {
  const dispatch = useDispatch();
  const channel = useSelector(selectors.getChannel({ id }));
  useEffect(() => {
    if (!channel) {
      dispatch(findChannel(id));
    }
  }, [id, channel, dispatch]);
  const { name, private: priv } = channel || {};
  return (
    <div className='channel' data-id={id} onClick={onclick}>
      {!icon && ( priv ? <i class='fa-solid fa-lock' /> : <i class='fa-solid fa-hashtag' />) }
      {icon && <i class={icon} />}
      <span class='name'>{name}</span>
    </div>
  );
}

const ListChannel = ({
  channelId: id, onclick, active, icon, badge,
}) => {
  const dispatch = useDispatch();
  const channel = useSelector(selectors.getChannel({ id }));
  useEffect(() => {
    if (!channel) {
      dispatch(findChannel(id));
    }
  }, [id, channel, dispatch]);
  const { name, private: priv } = channel || {};
  return (
    <div class={`channel ${active ? 'active' : ''}`}data-id={id} onclick={onclick}>
      {!icon && ( priv ? <i class='fa-solid fa-lock' /> : <i class='fa-solid fa-hashtag' />) }
      {icon && <i class={icon} />}
      <span class='name'>{name}</span>
      {badge > 0 && <Badge>{badge}</Badge>}
    </div>
  );
}

export const Channels = ({icon}) => {
  const dispatch = useDispatch();
  const channels = useSelector(selectors.getChannels);
  const userId = useSelector(selectors.getMyId);
  const badges = useSelector(selectors.getBadges(userId));
  const id = useSelector(selectors.getChannelId);
  return (
    <div class='channels'>
      <div class='header'>channels</div>
      { channels && channels.map((c) => (
        <ListChannel
          channelId={c.id}
          {...c}
          active={id === c.id}
          key={c.id}
          icon={icon}
          badge={badges[c.id]}
          onclick={() => dispatch(openChannel({id: c.id}))}
        />
      ))}
      <ChannelCreate />
    </div>
  )
}
