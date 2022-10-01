import { h } from 'preact';
import {
  useState, useCallback, useEffect, useRef,
} from 'preact/hooks';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { loadPrevious, loadNext } from '../../services/messages';
import { actions, selectors } from '../../state';
import {messageFormatter } from './formatter';
import {MessageList } from './messageList';
import {Header} from './header';
import { uploadMany } from '../../services/file';
import { Input } from '../input.js';
import { EmojiSelector } from '../EmojiSelector/EmojiSelector';
import {Loader} from '../loader';

const drop = (dispatch) => async (e) => {
  e.preventDefault();
  e.stopPropagation();
  const { files } = e.dataTransfer;
  dispatch(uploadMany(files))
}

function dragOverHandler(ev) {
  ev.preventDefault();
  ev.stopPropagation();
}

const StyledConversation = styled.div`
  flex: 1;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

export function Conversation() {
  const dispatch = useDispatch();
  const messages = useSelector(selectors.getMessages);
  const loading = useSelector(selectors.getMessagesLoading);
  const failed = useSelector(selectors.getMessagesLoadingFailed);
  const channel = useSelector(selectors.getCid);
  const status = useSelector(selectors.getMessagesStatus);
  const selected = useSelector(selectors.getSelectedMessage);

  return (
    <StyledConversation onDrop={drop(dispatch)} onDragOver={dragOverHandler}>
      <Header onclick={() => {
        dispatch(actions.setView('sidebar'));
      }} />
      <MessageList
        formatter={messageFormatter}
        list={messages}
        status={status}
        selected={selected}
        onScrollTo={(dir) => {
          if (dir === 'top') {
            dispatch(loadPrevious(channel))
          }
          if (dir === 'bottom') {
            dispatch(loadNext(channel))
          }
        }}
      />
      {loading && <div>
        <Loader />
      </div>}
    {failed && <div> 
      <i class="fa-solid fa-rotate"></i>
        Loading failed. Click for retry
    </div>}

      <Input />
      <EmojiSelector />
    </StyledConversation>
  )
}
