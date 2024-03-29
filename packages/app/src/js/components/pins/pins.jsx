/* eslint-disable no-await-in-loop */
import { useCallback } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { HoverContext } from '../../contexts/hover';
import { messageFormatter } from '../MessageList/formatter';
import { MessageList } from '../MessageList/MessageList';
import { useStream } from '../../contexts/stream';
import { Header } from './header';

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

export const Pins = () => {
  const [{ channelId }, setStream] = useStream();
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.pins[channelId]);
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
      <HoverContext>
        <Header />
        <MessageList
          formatter={messageFormatter}
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
      </HoverContext>
    </StyledPins>
  );
};
