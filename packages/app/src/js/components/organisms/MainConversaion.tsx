import styled from 'styled-components';
import { Conversation } from './Conversation';
import { useActions, useDispatch, useMessage, useMethods } from '../../store';
import { Channel } from '../molecules/NavChannel';
import { init } from '../../services/init';
import { useStream } from '../contexts/useStream';
import { loadMessages } from '../../services/messages';
import { Toolbar } from '../atoms/Toolbar';
import { ButtonWithIcon } from '../molecules/ButtonWithIcon';

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

export const Header = ({ onClick }: HeaderProps) => {
  const [stream, setStream] = useStream();
  const { channelId, parentId } = stream;
  const dispatch = useDispatch();
  const methods = useMethods();
  const actions = useActions();
  const message = useMessage(parentId);

  if (parentId) {
    return (
      <StyledHeader>
        <h1>Thread</h1>
        <Channel onClick={onClick} channelId={channelId} />

        <Toolbar className="toolbar" size={50}>
          <ButtonWithIcon icon="back" onClick={() => setStream({ channelId, type: 'archive', selected: message?.id, date: message?.createdAt })} />
          {stream.id !== 'main' && <ButtonWithIcon icon="xmark" onClick={() => setStream(null)} />}
        </Toolbar>
      </StyledHeader>
    );
  }

  return (
    <StyledHeader>
      <Toolbar className="toolbar" size={50}>
        <ButtonWithIcon icon="hash" onClick={onClick} />
        <Channel onClick={onClick} channelId={channelId} />
        {stream.type === 'archive' && (
          <ButtonWithIcon icon='down' onClick = {() => {
            dispatch(actions.messages.clear({ stream }));
            setStream({ ...stream, type: 'live' });
            dispatch(loadMessages({ ...stream, type: 'live' }))
          }} />
        )}
        <ButtonWithIcon icon="thumbtack" onClick={() => {
          dispatch(methods.pins.load(channelId));
          dispatch(actions.view.set('pins'));
        }} />
        <ButtonWithIcon icon="search" onClick={() => dispatch(actions.view.set('search'))} />
        <ButtonWithIcon icon="refresh" onClick={() => dispatch(init({}))} />
      </Toolbar>
    </StyledHeader>
  );
};

const Container = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--primary_border_color);
`;

type MainConversationProps = {
  className?: string;
  onClick?: () => void;
};

export const MainConversation = ({ className, onClick }: MainConversationProps) => (
  <Container className={className}>
    <Header onClick={onClick} />
    <Conversation />
  </Container>
);
