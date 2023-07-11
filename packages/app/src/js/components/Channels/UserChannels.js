import { h } from 'preact';
import {useState} from 'preact/hooks';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { ChannelCreate } from '../ChannelCreate/ChannelCreate';
import { Channel } from './Channel';
import { useBadges, useChannels, useUserChannels } from '../../hooks';

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

export const UserChannels = ({ icon }) => {
  const dispatch = useDispatch();
  const channels = useUserChannels();
  const userId = useSelector((state) => state.me);
  const badges = useBadges(userId);
  const id = useSelector((state) => state.stream.mainChannelId);
  return (
    <ChannelsContainer>
      <div class='header'>
        <span class='title'>users</span>
      </div>
      { channels && channels.map((c) => (
        <Channel
          channelId={c.id}
          {...c}
          className={id === c.id ? 'active' : ''}
          key={c.id}
          icon='fa-solid fa-user'
          badge={badges[c.id]}
          onclick={() => {
            dispatch.actions.stream.open({id: 'main', value: { type: 'live', channelId: c.id }});
            dispatch.actions.view.set(null);
          }}
        />
      ))}
    </ChannelsContainer>
  );
};
