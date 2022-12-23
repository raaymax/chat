import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { loadMessages, loadPrevious, loadNext } from '../../services/messages';
import { updateProgress } from '../../services/progress';
import { actions, selectors } from '../../state';
import { messageFormatter } from './formatter';
import { MessageList } from './messageList';
import { uploadMany } from '../../services/file';
import { Input } from '../Input/Input';
import { Loader } from '../loader';
import { reinit } from '../../services/init';

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

export function Conversation({ stream }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadMessages(stream));
  }, [stream, dispatch]);
  const messages = useSelector(selectors.getStreamMessages(stream));
  const initFailed = useSelector(selectors.getInitFailed);
  const loading = useSelector(selectors.getMessagesLoading);
  const status = useSelector(selectors.getMessagesStatus);
  const selected = useSelector(selectors.getSelectedMessage);
  const progress = useSelector(selectors.getProgress(stream));
  const list = messages.map((m) => ({...m, progress: progress[m.id]}));

  useEffect(() => {
    const cb = () => {
      const latest = list.find(({priv}) => !priv);
      if (latest?.id) dispatch(updateProgress(latest.id));
    };
    window.addEventListener('focus', cb);
    return () => window.removeEventListener('focus', cb);
  }, [list, dispatch]);

  return (
    <StyledConversation onDrop={drop(dispatch)} onDragOver={dragOverHandler}>
      <MessageList
        formatter={messageFormatter}
        list={list}
        status={status}
        selected={selected}
        onScrollTo={(dir) => {
          if (dir === 'top') {
            dispatch(loadPrevious(stream))
          }
          if (dir === 'bottom') {
            dispatch(loadNext(stream))
          }
        }}
      />
      {loading && <StyledLoader><div>
        <Loader />
      </div></StyledLoader>}
      <Input stream={stream} />
      {initFailed && <ReInit onClick={() => dispatch(reinit())}>
        Failed to initialize<br />
        Retry
      </ReInit>}
    </StyledConversation>
  )
}
