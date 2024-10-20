import styled from 'styled-components';
import { Conversation } from '../organisms/Conversation';
import {
  useActions, useDispatch, useMessage, useMethods,
} from '../../store';
import { Channel } from '../molecules/NavChannel';
import { init } from '../../services/init';
import { useStream } from '../contexts/useStream';
import { loadMessages } from '../../services/messages';
import { Toolbar } from '../atoms/Toolbar';
import { ButtonWithIcon } from '../molecules/ButtonWithIcon';
import { useNavigate } from 'react-router-dom';
import { useSidebar } from '../contexts/useSidebar';

const StyledHeader = styled.div`
  display: flex;
  flex-direction: row;
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
    flex: 1;
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

type HeaderProps = {
  onClick?: () => void;
};

export const DiscussionHeader = ({ onClick }: HeaderProps) => {
  const [stream, setStream] = useStream();
  const { channelId, parentId } = stream;
  const dispatch = useDispatch();
  const methods = useMethods();
  const actions = useActions();
  const message = useMessage(parentId);
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();

  if (parentId) {
    return (
      <StyledHeader>
        <h1>Thread</h1>
        <Channel onClick={onClick} channelId={channelId} />

        <Toolbar className="toolbar" size={50}>
          <ButtonWithIcon icon="back" onClick={() => {
            navigate("..", { relative: "path" });
            setStream({
              channelId, type: 'archive', selected: message?.id, date: message?.createdAt,
            })
          }} />
          {stream.id !== 'main' && <ButtonWithIcon icon="xmark" onClick={() => setStream(null)} />}
        </Toolbar>
      </StyledHeader>
    );
  }

  return (
    <StyledHeader>
      <Toolbar className="toolbar" size={50}>
        <ButtonWithIcon icon="bars" onClick={toggleSidebar} />
        <Channel onClick={onClick} channelId={channelId} />
        {stream.type === 'archive' && (
          <ButtonWithIcon icon='down' onClick = {() => {
            dispatch(actions.messages.clear({ stream }));
            setStream({ ...stream, type: 'live' });
            dispatch(loadMessages({ ...stream, type: 'live' }));
          }} />
        )}
        <ButtonWithIcon icon="thumbtack" onClick={() => {
          //dispatch(methods.pins.load(channelId));
          navigate("/"+ channelId + "/pins")
          //dispatch(actions.view.set('pins'));
        }} />
        <ButtonWithIcon icon="search" onClick={() => navigate("/"+ channelId + "/search")} />
        <ButtonWithIcon icon="refresh" onClick={() => dispatch(init({}))} />
      </Toolbar>
    </StyledHeader>
  );
};
