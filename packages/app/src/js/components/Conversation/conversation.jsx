import { useEffect, useCallback} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { messageFormatter } from '../MessageList/formatter';
import { MessageList } from '../MessageList/MessageList';
import { uploadMany } from '../../services/file';
import { Input } from '../Input/Input';
import { reinit } from '../../services/init';
import { HoverContext } from '../../contexts/hover';
import { useStream, useMessages } from '../../contexts/stream';
import { Container } from './elements/container';
import { InitFailedButton } from './elements/initFailedButton';
import { useProgress } from '../../hooks';
import { LoadingIndicator } from './LoadingIndicator';

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
  const [stream, setStream] = useStream();
  const dispatch = useDispatch();
  const {messages, next, prev} = useMessages();
  const initFailed = useSelector((state) => state.system.initFailed);
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
      <HoverContext>
        <MessageList
          formatter={messageFormatter}
          list={list}
          status={status}
          selected={stream.selected}
          onDateChange={(date) => setStream({ ...stream, date })}
          onScrollTop={async () => {
            await prev();
            setStream({...stream, type: 'archive', selected: undefined});
            bumpProgress();
          }}
          onScrollBottom={async () => {
            const count = await next();
            if (count === 1) {
              setStream({...stream, type: 'live', selected: undefined});
            }
            bumpProgress();
          }}
        />
        <LoadingIndicator />
        <Input />
        {initFailed && <InitFailedButton onClick={() => dispatch(reinit())} />}
      </HoverContext>
    </Container>
  );
}
