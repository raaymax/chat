import styled from 'styled-components';
import { Channel } from '../molecules/NavChannel';
import { useStream } from '../contexts/stream';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HoverProvider } from '../contexts/hover';
import { MessageList } from '../organisms/MessageListScroller'

const StyledPins = styled.div`
  width: 100vw;
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
  background-color: var(--primary_background);
  background-color: #1a1d21;
  border-bottom: 1px solid #565856;
  height: 51px;

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
  const dispatch: any = useDispatch();
  const [{channelId}] = useStream();

  return (
    <StyledHeader>
      <Channel channelId={channelId} icon="fa-solid fa-thumbtack" />
      <div className='toolbar'>
        <div className='tool' onClick={() => dispatch.actions.view.set('pins')}>
          <i className="fa-solid fa-xmark" />
        </div>
      </div>
    </StyledHeader>
  );
};

export const Pins = () => {
  const [{ channelId }, setStream] = useStream();
  const dispatch:any = useDispatch();
  const messages = useSelector((state:any) => state.pins[channelId]);
  const gotoMessage = useCallback((msg) => {
    dispatch.actions.view.set('pins');
    setStream({
      type: 'archive',
      channelId: msg.channelId,
      parentId: msg.parentId,
      selected: msg.id,
      date: msg.createdAt,
    });
  }, [dispatch, setStream]);
  return (
    <StyledPins className='pins'>
      <HoverProvider>
        <Header />
        <MessageList
          list={messages || []}
          status='live'
          onMessageClicked={(msg) => {
            gotoMessage(msg);
          }}
          onScrollTo={(dir) => {
            if (dir === 'top') {
              // dispatch(loadPrevious(channel))
            }
            if (dir === 'bottom') {
              // dispatch(loadNext(channel))
            }
          }}
        />
      </HoverProvider>
    </StyledPins>
  );
};
