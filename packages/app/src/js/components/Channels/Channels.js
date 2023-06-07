import { h } from 'preact';
import { useDispatch, useSelector } from 'react-redux';
import { setStream } from '../../services/stream';
import { actions, selectors } from '../../state';
import { ChannelCreate } from '../ChannelCreate/ChannelCreate';
import { Channel } from './Channel';

export const Channels = ({ icon }) => {
  const dispatch = useDispatch();
  const channels = useSelector(selectors.getChannels);
  const userId = useSelector(selectors.getMyId);
  const badges = useSelector(selectors.getBadges(userId));
  const id = useSelector(selectors.getChannelId);
  return (
    <div class='channels'>
      <div class='header'>channels</div>
      { channels && channels.map((c) => (
        <Channel
          channelId={c.id}
          {...c}
          className={id === c.id ? 'active' : ''}
          key={c.id}
          icon={icon}
          badge={badges[c.id]}
          onclick={() => {
            dispatch(setStream('main', { type: 'live', channelId: c.id }));
            dispatch(actions.setView(null));
          }}
        />
      ))}
      <ChannelCreate />
    </div>
  );
};
