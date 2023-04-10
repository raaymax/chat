import { h } from 'preact';
import { useEffect, useCallback, useState } from 'preact/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { loadPrevious, loadNext, loadMessages } from '../../services/messages';
import { updateProgress, loadProgress } from '../../services/progress';
import { selectors } from '../../state';
import { messageFormatter } from '../MessageList/formatter';
import { MessageList } from '../MessageList/MessageList';
import { uploadMany } from '../../services/file';
import { Input } from '../Input/Input';
import { Loader } from './elements/loader';
import { reinit } from '../../services/init';
import { ConversationContext } from '../../contexts/conversation';
import { HoverContext } from '../../contexts/hover';
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

export function Conversation({ saveLocation }) {
  const [lastStream, setLastStream] = useState({});
  const [stream] = useStream();
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

  useEffect(() => {
    if (lastStream.channelId === stream.channelId
      && lastStream.parentId === stream.parentId) return;
    dispatch(loadMessages(stream, saveLocation));
    dispatch(loadProgress(stream, saveLocation));
    setLastStream(stream);
  }, [dispatch, stream, lastStream, saveLocation]);

  return (
    <Container onDrop={drop(dispatch)} onDragOver={dragOverHandler}>
      <ConversationContext>
        <HoverContext>
          <MessageList
            formatter={messageFormatter}
            list={list}
            status={status}
            selected={stream.selected}
            onScrollTo={(dir) => {
              if (dir === 'top') {
                dispatch(loadPrevious(stream, saveLocation))
                bumpProgress();
              }
              if (dir === 'bottom') {
                dispatch(loadNext(stream, saveLocation))
                bumpProgress();
              }
            }}
          />
          {loading && <Loader />}
          <Input />
          {initFailed && <InitFailedButton onClick={() => dispatch(reinit())} />}
        </HoverContext>
      </ConversationContext>
    </Container>
  )
}
