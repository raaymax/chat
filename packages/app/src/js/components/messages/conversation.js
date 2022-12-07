import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { loadPrevious, loadNext } from '../../services/messages';
import { updateProgress } from '../../services/progress';
import { actions, selectors } from '../../state';
import { messageFormatter } from './formatter';
import { MessageList } from './messageList';
import { Header } from './header';
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
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
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
  const dispatch = useDispatch();
  const messages = useSelector(selectors.getMessages);
  const initFailed = useSelector(selectors.getInitFailed);
  const loading = useSelector(selectors.getMessagesLoading);
  const channel = useSelector(selectors.getCid);
  const status = useSelector(selectors.getMessagesStatus);
  const selected = useSelector(selectors.getSelectedMessage);
  const progress = useSelector(selectors.getProgress(channel));
  const list = messages.map((m) => ({...m, progress: progress[m.id]}));

  useEffect(() => {
    const cb = () => list.length > 0 && dispatch(updateProgress(list[0].id))
    window.addEventListener('focus', cb);
    return () => window.removeEventListener('focus', cb);
  }, [list, dispatch]);

  return (
    <StyledConversation onDrop={drop(dispatch)} onDragOver={dragOverHandler}>
      <Header onclick={() => {
        dispatch(actions.setView('sidebar'));
      }} />
      <MessageList
        formatter={messageFormatter}
        list={list}
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
      {loading && <StyledLoader><div>
        <Loader />
      </div></StyledLoader>}
      <Input />
      {initFailed && <ReInit onClick={() => dispatch(reinit())}>
        Failed to initialize<br />
        Retry
      </ReInit>}
    </StyledConversation>
  )
}
