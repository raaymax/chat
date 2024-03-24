import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Channel } from '../../components/Channels/Channel';
import { init } from '../../services/init';
import { useStream } from '../../contexts/stream';
import { useMessage } from '../../hooks';
import { loadMessages } from '../../services/messages';
import { Toolbar } from '../../atomic/organisms/Toolbar';

const StyledHeader = styled.div`
  display: flex;
  flex-direction: row;
  background-color: var(--primary_background);
  background-color: #1a1d21;
  border-bottom: 1px solid #565856;
  height: 51px;

  & h1 {
    padding: 0;
    margin: 0;
    padding-left: 20px;
    width: auto;
    flex: 0;
    font-size: 30px;
    font-weight: 400;
  }

  & > * {
    flex: 1;
    height: 50px;
    line-height: 50px;

  }

  & .channel{
    padding-left: 30px;
    vertical-align: middle;
    font-size: 20px;
    font-weight: bold;
  }
  & .channel i{
    font-size: 1.3em;
  }
  & .channel .name{
    padding-left: 10px;
  }
  & .toolbar {
    flex: 1;
    flex-align: right;
    display:flex;
  }
`;

export const Header = ({ onClick }) => {
  const [stream, setStream] = useStream();
  const { channelId, parentId } = stream;
  const dispatch = useDispatch();
  const message = useMessage(parentId);

  if (parentId) {
    return (
      <StyledHeader>
        <h1>Thread</h1>
        <Channel onClick={onClick} channelId={channelId} />

        <Toolbar className="toolbar" size={50} opts = {[
          {icon: 'fa-solid fa-arrow-left', handler: () => setStream({ channelId, type: 'archive', selected: message.id, date: message.createdAt })},
          stream.id !== 'main' && {icon: 'fa-solid fa-xmark', handler: () => setStream(null)},
        ]} />
      </StyledHeader>
    );
  }

  return (
    <StyledHeader>
      <Toolbar className="toolbar" size={50} opts = {[
        {icon: 'fa-solid fa-hashtag', handler: onClick},
        {element: () => <Channel onClick={onClick} channelId={channelId} />},
        stream.type === 'archive' && {icon: 'fa-solid fa-down-long', handler: () => {
          dispatch.actions.messages.clear({ stream });
          setStream({ ...stream, type: 'live' });
          dispatch(loadMessages({ ...stream, type: 'live' }))
        }},
        {icon: 'fa-solid fa-thumbtack', handler: () => {
          dispatch.methods.pins.load(channelId);
          dispatch.actions.view.set('pins');
        }},
        {icon: 'fa-solid fa-magnifying-glass', handler: () => dispatch.actions.view.set('search')},
        {icon: 'fa-solid fa-arrows-rotate', handler: () => dispatch(init())},
      ]} />
    </StyledHeader>
  );
};
