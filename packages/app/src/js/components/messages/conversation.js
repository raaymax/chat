import { h } from 'preact';
import { useEffect, useCallback } from 'preact/hooks';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { loadMessages, loadPrevious, loadNext } from '../../services/messages';
import { loadProgress, updateProgress } from '../../services/progress';
import { selectors } from '../../state';
import { messageFormatter } from './formatter';
import { MessageList } from './messageList';
import { uploadMany } from '../../services/file';
import { Input } from '../Input/Input';
import { Loader } from '../loader';
import { reinit } from '../../services/init';
import { ConversationContext } from './conversationContext';
import { useStream } from '../streamContext';

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
  width: 100%;
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--primary_border_color);
`;

const StyledLoader = styled.div`
  position: relative;
  height: 0;
  width: 100%;

  & div {
    position: absolute;
    top: -20px;
    width: 100%;
  }
`;

const ReInit = styled.div`
  cursor: pointer;
  border: 0;
  text-align: center;
  color: var(--color_danger);
  vertical-align: middle;
  height: 50px;
  line-height: 25px;
  border-top: 1px solid var(--border_color);
  &:hover {
    background-color: var(--secondary_background);
  }
`;

export function Conversation() {
  const [stream, setStream] = useStream();
  const dispatch = useDispatch();
  const messages = useSelector(selectors.getStreamMessages(stream));
  const initFailed = useSelector(selectors.getInitFailed);
  const loading = useSelector(selectors.getMessagesLoading);
  const status = stream.type;
  const selected = useSelector(selectors.getSelectedMessage);
  const progress = useSelector(selectors.getProgress(stream));
  const list = messages.map((m) => ({...m, progress: progress[m.id]}));

  const bumpProgress = useCallback(() => {
    const latest = list.find(({priv}) => !priv);
    if (latest?.id) dispatch(updateProgress(latest.id));
  }, [dispatch, list]);
  useEffect(() => {
    window.addEventListener('focus', bumpProgress);
    return () => {
      window.removeEventListener('focus', bumpProgress);
    }
  }, [bumpProgress]);

  return (
    <StyledConversation onDrop={drop(dispatch)} onDragOver={dragOverHandler}>
      <ConversationContext value={{ stream, setStream, messages, selected }}>
        <MessageList
          formatter={messageFormatter}
          list={list}
          status={status}
          selected={stream.selected}
          onScrollTo={(dir) => {
            if (dir === 'top') {
              dispatch(loadPrevious(stream, setStream))
              bumpProgress();
            }
            if (dir === 'bottom') {
              dispatch(loadNext(stream, setStream))
              bumpProgress();
            }
          }}
        />
        {loading && <StyledLoader><div>
          <Loader />
        </div></StyledLoader>}
        <Input />
        {initFailed && <ReInit onClick={() => dispatch(reinit())}>
          Failed to initialize<br />
          Retry
        </ReInit>}
      </ConversationContext>
    </StyledConversation>
  )
}
