import styled from 'styled-components';
import {
  useSelector, useBadges, useUserChannels, useActions, useDispatch,
} from '../../store';
import { NavUserButton } from './NavUser';

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

export const NavUsers = () => {
  const dispatch = useDispatch();
  const actions = useActions();
  const channels = useUserChannels();
  const userId = useSelector((state) => state.me);
  const badges = useBadges(userId);
  const id = useSelector((state) => state.stream.mainChannelId);
  return (
    <ChannelsContainer>
      <div className='header'>
        <span className='title'>users</span>
      </div>
      { channels && channels.map((c) => (
        <NavUserButton
          size={30}
          channel={c}
          className={{ active: id === c.id }}
          key={c.id}
          badge={badges[c.id]}
          onClick={() => {
            dispatch(actions.stream.open({ id: 'main', value: { type: 'live', channelId: c.id } }));
            dispatch(actions.view.set(null));
          }}
        />
      ))}
    </ChannelsContainer>
  );
};
