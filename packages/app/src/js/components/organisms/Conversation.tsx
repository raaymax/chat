import { useEffect, useCallback} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MessageList } from './MessageListScroller';
import { uploadMany } from '../../services/file';
import { Input } from '../organisms/Input';
import { reinit } from '../../services/init';
import { HoverProvider } from '../contexts/hover';
import { useStream } from '../contexts/useStream';
import { useMessages } from '../contexts/useMessages';
import { useProgress } from '../../hooks';
import { LoadingIndicator } from '../molecules/LoadingIndicator';
import styled from 'styled-components';
import { Message as MessageType } from '../../types';

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

type InitFailedButtonProps = {
  onClick?: () => void;
};

export const InitFailedButton = ({ onClick }: InitFailedButtonProps) => (
  <ReInit onClick={onClick}>
    Failed to initialize<br />
    Click to retry...
  </ReInit>
);

export const Container = styled.div`
  flex: 1;
  width: 100%;
  height: calc(100% - 50px);
  display: flex;
  flex-direction: column;
`;

const drop = (dispatch: any, streamId: string| undefined) => async (e: React.DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  if(!streamId) return;
  const { files } = e.dataTransfer;
  dispatch(uploadMany(streamId, files));
};

function dragOverHandler(ev: React.DragEvent) {
  ev.preventDefault();
  ev.stopPropagation();
}

export function Conversation() {
  const [stream, setStream] = useStream();
  const dispatch: any = useDispatch();
  const {messages, next, prev} = useMessages();
  const initFailed = useSelector((state: any) => state.system.initFailed);
  const progress = useProgress({channelId: stream.channelId, parentId: stream.parentId});
  const list: MessageType[] = messages.map((m: MessageType) => ({ ...m, progress: progress[m.id ?? ''] }));

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
      <HoverProvider>
        <MessageList
          list={list}
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
      </HoverProvider>
    </Container>
  );
}
