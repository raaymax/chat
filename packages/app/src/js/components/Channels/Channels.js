import { h } from 'preact';
import {useState} from 'preact/hooks';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { setStream } from '../../services/stream';
import { selectors } from '../../store';
import { ChannelCreate } from '../ChannelCreate/ChannelCreate';
import { Channel } from './Channel';
import { useBadges, useChannels } from '../../hooks';

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

  .channel {
    padding: 5px 5px 5px 20px; 
    cursor: pointer;
  }
  .channel .name {
    padding: 0px 10px; 
    cursor: pointer;
  }
  .channel.active {
    background-color: var(--primary_active_mask);
  }

  .channel:hover {
    background-color: var(--primary_active_mask);
  }
`;

export const Channels = ({ icon }) => {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const channels = useChannels();
  const userId = useSelector((state) => state.me);
  const badges = useBadges(userId);
  const id = useSelector((state) => state.stream.mainChannelId);
  return (
    <ChannelsContainer>
      <div class='header'><span class='title'>channels</span> <i class={show ? 'fa-solid fa-minus' : 'fa-solid fa-plus'} onClick={() => setShow(!show)} /></div>
      {show && <ChannelCreate />}
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
            dispatch.actions.view.set(null);
          }}
        />
      ))}
    </ChannelsContainer>
  );
};
