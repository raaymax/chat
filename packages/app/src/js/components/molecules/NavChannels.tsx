import {useState} from 'react';
import { useSelector, useBadges, useChannels, useActions, useDispatch } from '../../store';
import styled from 'styled-components';
import { ChannelCreate } from './ChannelCreate';
import { Channel } from './NavChannel';

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

type NavChannelsProps = {
  icon?: string;
};

export const NavChannels = ({ icon }: NavChannelsProps) => {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const actions = useActions();
  const channels = useChannels();
  const userId = useSelector((state) => state.me);
  const badges = useBadges(userId);
  const id = useSelector((state) => state.stream.mainChannelId);
  return (
    <ChannelsContainer>
      <div className='header'>
        <span className='title'>channels</span>
        <i className={show ? 'fa-solid fa-minus' : 'fa-solid fa-plus'} onClick={() => setShow(!show)} />
      </div>
      {show && <ChannelCreate />}
      { channels && channels.map((c) => (
        <Channel
          channelId={c.id}
          {...c}
          className={{active: id === c.id}}
          key={c.id}
          icon={icon ?? 'hash'}
          badge={badges[c.id]}
          onClick={() => {
            dispatch(actions.stream.open({id: 'main', value: { type: 'live', channelId: c.id }}));
            dispatch(actions.view.set(null));
          }}
        />
      ))}
    </ChannelsContainer>
  );
};