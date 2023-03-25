import { h } from 'preact';
import { useEffect, useCallback } from 'preact/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { loadPrevious, loadNext } from '../../services/messages';
import { updateProgress } from '../../services/progress';
import { selectors } from '../../state';
import { messageFormatter } from '../messages/formatter';
import { MessageList } from '../messages/messageList';
import { uploadMany } from '../../services/file';
import { Input } from '../Input/Input';
import { Loader } from './elements/loader';
import { reinit } from '../../services/init';
import { ConversationContext } from '../../contexts/conversation';
import { useStream } from '../../contexts/stream';
import { Container } from './elements/container';
import { InitFailedButton } from './elements/initFailedButton';

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

export function Conversation() {
  const [stream, setStream] = useStream();
  const dispatch = useDispatch();
  const messages = useSelector(selectors.getStreamMessages(stream));
  const initFailed = useSelector(selectors.getInitFailed);
  const loading = useSelector(selectors.getMessagesLoading);
  const status = stream.type;
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
    <Container onDrop={drop(dispatch)} onDragOver={dragOverHandler}>
      <ConversationContext>
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
        {loading && <Loader />}
        <Input />
        {initFailed && <InitFailedButton onClick={() => dispatch(reinit())} />}
      </ConversationContext>
    </Container>
  )
}
