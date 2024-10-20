import styled from 'styled-components';
import { StreamProvider } from '../contexts/stream';
import { Conversation } from '../organisms/Conversation';
import {
  useActions, useDispatch, useMainStream, useMessage, useMethods,
  useSideStream,
} from '../../store';
import { Channel } from '../molecules/NavChannel';
import { init } from '../../services/init';
import { useStream } from '../contexts/useStream';
import { loadMessages } from '../../services/messages';
import { Toolbar } from '../atoms/Toolbar';
import { ButtonWithIcon } from '../molecules/ButtonWithIcon';
import { useNavigate } from 'react-router-dom';
import { useSidebar } from '../contexts/useSidebar';
import { isMobile } from '../../utils';

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

export const Header = ({ onClick }: HeaderProps) => {
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
            //navigate("..", { relative: "path" });
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

const Container = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
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


const SideStyledHeader = styled.div`
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
  & * {
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
    flex: 0;
    display:flex;
    flex-direction: row;
  }
`;

type SideHeaderProps = {
  onClick?: () => void;
};

export const SideHeader = ({ onClick }: SideHeaderProps) => {
  const [{ channelId, parentId }, setSideStream] = useStream();
  const dispatch = useDispatch();
  const actions = useActions();
  const message = useMessage(parentId);

  return (
    <SideStyledHeader>
      <h1>Thread</h1>
      <Channel onClick={onClick} channelId={channelId} />

      <Toolbar className="toolbar" size={50}>
        <ButtonWithIcon icon='back' onClick={() => {
          setSideStream(null);
          dispatch(actions.stream.open({
            id: 'main',
            value: {
              channelId, type: 'archive', selected: message?.id, date: message?.createdAt,
            },
          }));
        }} />
        <ButtonWithIcon icon='xmark' onClick={() => dispatch(actions.stream.open({ id: 'side', value: null }))} />
      </Toolbar>
    </SideStyledHeader>
  );
};

const SideContainer = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--primary_border_color);
`;

type SideConversationProps = {
  className?: string;
};

export const SideConversation = ({ className }: SideConversationProps) => (
  <SideContainer className={className}>
    <SideHeader />
    <Conversation />
  </SideContainer>
);

const DiscussionContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
`;

type DiscussionProps = {
  className?: string;
};

export const Discussion = ({ className }: DiscussionProps) => {
  
  const dispatch = useDispatch();
  const actions = useActions();
  const mainStream = useMainStream();
  const sideStream = useSideStream();
  return (
    <DiscussionContainer className={className}>
      {(!isMobile() || !sideStream) && <StreamProvider value={[mainStream, (val) => dispatch(actions.stream.open({ id: 'main', value: val }))]}>
        <MainConversation />
      </StreamProvider>}
      {sideStream && 
        <StreamProvider value={[sideStream, (val) => dispatch(actions.stream.open({ id: 'side', value: val }))]}>
          <SideConversation />
        </StreamProvider>
      }
    </DiscussionContainer>
  );
}
