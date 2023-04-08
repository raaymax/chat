import { h } from 'preact';
import { useState, useCallback, useEffect } from 'preact/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { removeMessage } from '../../services/messages';
import { pinMessage, unpinMessage } from '../../services/pins';
import { Reaction } from '../Reaction/Reaction';
import { setStream } from '../../services/stream';
import { useHovered } from '../../contexts/conversation';
import { useStream } from '../../contexts/stream';
import { useMessageData, useMessageUser } from '../../contexts/message';

import { Container } from './elements/container';

export const Toolbar = () => {
  const message = useMessageData();
  const user = useMessageUser();
  const {id, pinned, channelId} = message;
  const [view, setView] = useState(null);
  const dispatch = useDispatch();
  const [stream] = useStream();
  const onDelete = useCallback(() => {
    dispatch(removeMessage({id}));
  }, [dispatch, id]);
  const meId = useSelector((state) => state.users.meId);
  const isMe = user?.id === meId;
  const [hovered] = useHovered();

  useEffect(() => setView(null), [hovered]);

  if (hovered !== id) return null;

  const stop = (e) => { console.log('stop'); e.stopPropagation(); e.preventDefault(); };

  if (view === 'reactions') {
    return (
      <Container onClick={stop}>
        <Reaction messageId={id}>♥️</Reaction>
        <Reaction messageId={id}>🤣</Reaction>
        <Reaction messageId={id}>👍</Reaction>
        <Reaction messageId={id}>👎</Reaction>
        <Reaction messageId={id}>🎉</Reaction>
        <Reaction messageId={id}>👀</Reaction>
      </Container>
    );
  }

  if (view === 'delete') {
    return (
      <Container onClick={stop}>
        <i class='fa-solid fa-circle-check danger' onclick={onDelete} />
        <i class='fa-solid fa-circle-xmark' onclick={() => setView(null)} />
      </Container>
    );
  }

  return (
    <Container onClick={stop}>
      <i class="fa-solid fa-icons" onClick={() => setView('reactions')} />
      {!pinned
        ? <i class="fa-solid fa-thumbtack" onClick={() => dispatch(pinMessage(id, channelId))} />
        : <i class="fa-solid fa-thumbtack" style="color:Tomato" onClick={() => dispatch(unpinMessage(id, channelId))} />}
      { isMe && <i class='fa-solid fa-trash-can' onclick={() => setView('delete')} /> }
      {
        !stream.parentId && <i class="fa-solid fa-reply" onClick={() => dispatch(setStream('side', {type: 'live', channelId, parentId: id}))} />
      }
    </Container>
  );
}
