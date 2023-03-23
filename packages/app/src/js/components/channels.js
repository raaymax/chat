import { h} from 'preact';
import { useState, useCallback, useEffect } from 'preact/hooks';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { openChannel, createChannel, findChannel } from '../services/channels';
import { selectors } from '../state';

const Badge = styled.span`
  border-radius: 10px;
  background-color: #af0000;
  color: #ffffff;
  font-size: 0.8em;
  padding: 3px 5px;
`;

const InlineChannelLink = styled.a`
span {
  padding-left: 1px;
}
`;

export const InlineChannel = ({channelId: id, cid}) => {
  const dispatch = useDispatch();
  const channel = useSelector(selectors.getChannel({id, cid}));
  useEffect(() => {
    if (!channel) {
      dispatch(findChannel(id));
    }
  }, [id, channel, dispatch]);
  return (
    <InlineChannelLink className='channel' data-id={id} href={`#${channel?.id || id}`} >
      { channel?.private ? <i class='fa-solid fa-lock' /> : <i class='fa-solid fa-hashtag' /> }
      <span class='name'>{channel?.name || channel?.id || id}</span>
    </InlineChannelLink>
  );
}

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

const NewChannelContainer = styled.div`
  width: 100%;
  padding: 0;
  margin: 10px 0;
  form{ 
    display: flex;
    padding: 0;
    margin: 0;
    width: 100%;
  }
  input {
    padding: 0 0 0 19px;
    margin:0;
    border-radius: 0;
    background-color: ${props => props.theme.inputBackgroundColor};
    border: 1px solid #000000;
    border-right: none;
    flex: 1;
    height: 40px;
    &:focus {
      outline: none;
    }
  }
  button {
    margin:0;
    background-color: ${props => props.theme.actionButtonBackgroundColor};
    color: ${props => props.theme.actionButtonFontColor};
    border-radius: 0;
    border: 1px solid #000000;
    height: 40px;
    width: 40px;
    flex: 0 40px;
    &:hover {
      background-color: ${props => props.theme.actionButtonHoverBackgroundColor};
      color: ${props => props.theme.actionButtonFontColor};
    }
    &:active {
      background-color: ${props => props.theme.actionButtonActiveBackgroundColor};
      color: ${props => props.theme.actionButtonFontColor};
    }
  }
`;

export const NewChannel = () => {
  const [name, setName] = useState('');
  const dispatch = useDispatch();
  const submit = useCallback((e) => {
    dispatch(createChannel(name));
    setName('');
    e.preventDefault();
    e.stopPropagation();
  }, [dispatch, name, setName]);
  return (
    <NewChannelContainer>
      <form action="#" onSubmit={submit}>
        <input type='text' placeholder='Channel name' onChange={(e)=>setName(e.target.value)} value={name} />
        <button type='submit'>
          <i class="fa-solid fa-plus"></i>
        </button>
      </form>
    </NewChannelContainer>
  );
}

const ListChannel = ({channelId: id, onclick, active, icon, badge }) => { 
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
      <NewChannel />
    </div>
  )
}
