import { h } from 'preact';
import { useEffect, useCallback, useState } from 'preact/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { loadPrevious, loadNext, loadMessages } from '../../services/messages';
import { messageFormatter } from '../MessageList/formatter';
import { MessageList } from '../MessageList/MessageList';
import { uploadMany } from '../../services/file';
import { Input } from '../Input/Input';
import { Loader } from './elements/loader';
import { reinit } from '../../services/init';
import { ConversationContext } from '../../contexts/conversation';
import { HoverContext } from '../../contexts/hover';
import { useStream, useMessages } from '../../contexts/stream';
import { Container } from './elements/container';
import { InitFailedButton } from './elements/initFailedButton';
import { useProgress } from '../../hooks';

const drop = (dispatch, streamId) => async (e) => {
  e.preventDefault();
  e.stopPropagation();
  const { files } = e.dataTransfer;
  dispatch(uploadMany(streamId, files));
};

function dragOverHandler(ev) {
  ev.preventDefault();
  ev.stopPropagation();
}

export function Conversation() {
  const [lastStream, setLastStream] = useState({});
  const [stream] = useStream();
  const dispatch = useDispatch();
  const messages = useMessages();
  const initFailed = useSelector((state) => state.system.initFailed);
  const loading = useSelector((state) => state.messages.loading);
  const status = stream.type;
  const progress = useProgress(stream);
  const list = messages.map((m) => ({ ...m, progress: progress[m.id] }));

  const bumpProgress = useCallback(() => {
    const latest = list.find(({ priv }) => !priv);
    if (latest?.id) dispatch.methods.progress.update(latest.id);
  }, [dispatch, list]);

  useEffect(() => {
    window.addEventListener('focus', bumpProgress);
    return () => {
      window.removeEventListener('focus', bumpProgress);
    };
  }, [bumpProgress]);

  return (
    <Container onDrop={drop(dispatch, stream.id)} onDragOver={dragOverHandler}>
      <ConversationContext>
        <HoverContext>
          <MessageList
            formatter={messageFormatter}
            list={list}
            status={status}
            selected={stream.selected}
            onScrollTo={(dir) => {
              if (dir === 'top') {
                dispatch(loadPrevious(stream));
                bumpProgress();
              }
              if (dir === 'bottom') {
                dispatch(loadNext(stream));
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
  );
}
