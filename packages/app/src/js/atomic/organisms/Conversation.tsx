import { useEffect, useCallback} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MessageList } from '../molecules/MessageListScroller';
import { uploadMany } from '../../services/file';
import { Input } from '../organisms/Input';
import { reinit } from '../../services/init';
import { HoverContext } from '../contexts/hover';
import { useStream, useMessages } from '../contexts/stream';
import { useProgress } from '../../hooks';
import { LoadingIndicator } from '../molecules/LoadingIndicator';
import styled from 'styled-components';
import PropTypes from 'prop-types';

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

export const InitFailedButton = ({ onClick }) => (
  <ReInit onClick={onClick}>
    Failed to initialize<br />
    Click to retry...
  </ReInit>
);

InitFailedButton.propTypes = {
  onClick: PropTypes.func,
};

export const Container = styled.div`
  flex: 1;
  width: 100%;
  height: calc(100% - 50px);
  display: flex;
  flex-direction: column;
`;

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
