import styled from 'styled-components';
import { Conversation } from '../organisms/Conversation';
import { useActions, useDispatch, useMessage } from '../../store';
import { Channel } from '../molecules/NavChannel';
import { init } from '../../services/init';
import { Toolbar } from '../atoms/Toolbar';
import { ButtonWithIcon } from '../molecules/ButtonWithIcon';
import { useLocation, useNavigate, useParams} from 'react-router-dom';
import { useSidebar } from '../contexts/useSidebar';
import { ClassNames, cn, isMobile, same } from '../../utils';
import { useMessageListArgs } from '../contexts/useMessageListArgs';
import { MessageListArgsProvider } from '../contexts/messageListArgs';
import { useEffect } from 'react';

const StyledHeader = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid ${(props) => props.theme.Strokes};
  height: 64px;

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
    height: 64px;
    line-height: 64px;

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
  channelId: string;
  parentId?: string;
};

const Header = ({ channelId, onClick }: HeaderProps) => {
  const [stream] = useMessageListArgs();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();

  return (
    <StyledHeader>
      <Toolbar className="toolbar" size={64}>
        <ButtonWithIcon icon="bars" onClick={toggleSidebar} />
        <Channel onClick={onClick} channelId={channelId} />
        {stream.type === 'archive' && (
          <ButtonWithIcon icon='down' onClick = {() => {
            navigate(".", { relative: "path", state: {
              type: 'live',
              selected: null,
              date: null,
            } });
          }} />
        )}
        <ButtonWithIcon icon="thumbtack" onClick={() => {
          navigate("/"+ channelId + "/pins")
        }} />
        <ButtonWithIcon icon="search" onClick={() => navigate("/"+ channelId + "/search")} />
        <ButtonWithIcon icon="refresh" onClick={() => dispatch(init({}))} />
      </Toolbar>
    </StyledHeader>
  );
};

type SideHeaderProps = {
  onClick?: () => void;
  channelId: string;
  parentId?: string;
};

export const SideHeader = ({ channelId, parentId, onClick }: SideHeaderProps) => {
  const message = useMessage(parentId);
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();

  return (
    <StyledHeader>

      <Toolbar className="toolbar" size={64}>
        <ButtonWithIcon icon="bars" onClick={toggleSidebar} />
        <h1>Thread</h1>
        <Channel onClick={onClick} channelId={channelId} />
        <ButtonWithIcon icon='back' onClick={() => {
          navigate(`/${channelId}`, {state: {
            type: 'archive', selected: message?.id, date: message?.createdAt,
          }});
        }} />
        <ButtonWithIcon icon='xmark' onClick={() => {
          navigate(`/${channelId}`);
        }} />
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
  className?: ClassNames;
  onClick?: () => void;
  channelId: string;
  parentId?: string;
};

export const UpdateArgs = () => {
  const location = useLocation();
  const {channelId } = useParams();
  const [args, setArgs] = useMessageListArgs();
  useEffect(() => {
    const state = location.state || {};
    state.type = state.type ?? 'live';
    if(!same(args, state, ['type', 'selected', 'date'])) {
      setArgs(state);
    }
  }, [location.state, channelId]);

  return null
}

export const MainConversation = ({ channelId, parentId, className, onClick }: MainConversationProps) => {
  const location = useLocation();

  return (
    <MessageListArgsProvider streamId='main' value={location.state}>
      <UpdateArgs />
      <Container className={cn('main-conversation', className)}>
        <Header channelId={channelId} parentId={parentId} onClick={onClick} />
        <Conversation channelId={channelId} parentId={parentId} />
      </Container>
    </MessageListArgsProvider>
  );
}




const SideContainer = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--primary_border_color);
`;

type SideConversationProps = {
  className?: ClassNames
  channelId: string;
  parentId?: string;
};

export const SideConversation = ({ channelId, parentId, className }: SideConversationProps) => {
  return (
    <MessageListArgsProvider streamId="side">
      <SideContainer className={cn('side-conversation', className)}>
        <SideHeader channelId={channelId} parentId={parentId} />
        <Conversation channelId={channelId} parentId={parentId} />
      </SideContainer>
    </MessageListArgsProvider>
  );
}

const DiscussionContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;

  & .main-conversation {
  }

  & .side-conversation {
  }
  .sidebar-closed.side-stream & {
    @media (max-width: 896px) {
      & .main-conversation {
        display: none;
        flex: 0 0 0%;
      }
      & .side-conversation {
        flex: 1 100%;
      }
    }
  }

  .sidebar-open.side-stream & {
    @media (max-width: 1265px) {
      & .main-conversation {
        display: none;
        flex: 0 0 0%;
      }
      & .side-conversation {
        flex: 1 100%;
      }
    }
  }
`;

type DiscussionProps = {
  className?: string;
};

export const Discussion = ({ className }: DiscussionProps) => {
  const {channelId='', parentId} = useParams();
  return (
    <DiscussionContainer className={className}>
      {(!isMobile() || !parentId) && <MainConversation channelId={channelId} />}
      {parentId && <SideConversation channelId={channelId} parentId={parentId} />}
    </DiscussionContainer>
  );
}
