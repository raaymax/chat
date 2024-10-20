import styled from 'styled-components';
import { useCallback, useEffect } from 'react';
import { Channel } from '../molecules/NavChannel';
import { useStream } from '../contexts/useStream';
import { useActions, useDispatch, useMethods, useSelector } from '../../store';
import { HoverProvider } from '../contexts/hover';
import { MessageList } from '../organisms/MessageListScroller';
import { Message as MessageType } from '../../types';
import { useNavigate, useNavigation, useParams } from 'react-router-dom';
import { useSidebar } from '../contexts/useSidebar';
import { ButtonWithIcon } from '../molecules/ButtonWithIcon';

const StyledPins = styled.div`
  height: 100vh;
  flex: 0 100%;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #565856;
  border-right: 1px solid #565856;
  & .message:hover {
      background-color: var(--primary_active_mask);
  }
  &.hidden {
    flex: 0 0px;
    width: 0px;
  }
  & .form {
    background-color: #1a1d21;
    border-bottom: 1px solid #565856;
    & input {
      height: 70px;
    }
  }
`;

const StyledHeader = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #565856;
  height: 51px;


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
    flex: 0 50px;
    display:flex;
    flex-direction: row;
    & .tool {
      flex: 1;
      height: 50px;
      line-height: 50px;
      text-align: center;
      cursor: pointer;
      &:hover {
        background-color: var(--secondary_background);
      }
    }
  }
  i {
    flex: 0 50px;
    line-height: 50px;
    text-align: center;
    vertical-align: middle;
  }
`;

export const Header = () => {
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();
  const [{ channelId }] = useStream();

  return (
    <StyledHeader>
      <ButtonWithIcon size={50} icon="bars" onClick={toggleSidebar} />
      <Channel channelId={channelId} icon="fa-solid fa-thumbtack" />
      <div className='toolbar'>
        <div className='tool' onClick={() => navigate('..', {relative: 'path'})}>
          <i className="fa-solid fa-xmark" />
        </div>
      </div>
    </StyledHeader>
  );
};

export const Pins = () => {
  const { channelId } = useParams()!;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const methods = useMethods();
  const navigate = useNavigate();
  useEffect(() => {
    if (!channelId) {
      return navigate('/');
    }
    dispatch(methods.pins.load(channelId));
  }, [navigation])
  const messages = useSelector((state) => channelId ? state.pins[channelId] : []);
  const gotoMessage = useCallback((msg: MessageType) => {
    navigate(`/${msg.channelId}`, {
      state: {
        type: 'archive',
        channelId: msg.channelId,
        parentId: msg.parentId,
        selected: msg.id,
        date: msg.createdAt,
      }
    });
  }, [navigate]);
  return (
    <StyledPins className='pins'>
      <HoverProvider>
        <Header />
        <MessageList
          list={messages || []}
          onMessageClicked={(msg: MessageType) => {
            gotoMessage(msg);
          }}
        />
      </HoverProvider>
    </StyledPins>
  );
};
