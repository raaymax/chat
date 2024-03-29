import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeMessage } from '../../services/messages';
import { Reaction } from '../Reaction/Reaction';
import { useHovered } from '../../contexts/hover';
import { useStream } from '../../contexts/stream';
import { useMessageData, useMessageUser } from '../../contexts/message';

import { Container } from './elements/container';

export const Toolbar = () => {
  const message = useMessageData();
  const user = useMessageUser();
  const { id, pinned, channelId } = message;
  const [view, setView] = useState(null);
  const dispatch = useDispatch();
  const [stream] = useStream();
  const onDelete = useCallback(() => {
    dispatch(removeMessage({ id }));
  }, [dispatch, id]);
  const meId = useSelector((state) => state.me);
  const isMe = user?.id === meId;
  const [hovered] = useHovered();

  useEffect(() => setView(null), [hovered]);

  if (hovered !== id) return null;

  const stop = (e) => { e.stopPropagation(); e.preventDefault(); };

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
        <i className='fa-solid fa-circle-check danger' onClick={onDelete} />
        <i className='fa-solid fa-circle-xmark' onClick={() => setView(null)} />
      </Container>
    );
  }

  return (
    <Container onClick={stop}>
      <i className="fa-solid fa-icons" onClick={() => setView('reactions')} />
      <i className="fa-solid fa-pen-to-square" onClick={() => dispatch.actions.messages.toggleEdit(id)} />
      {!pinned
        ? <i className="fa-solid fa-thumbtack" onClick={() => dispatch.methods.pins.pin(id, channelId)} />
        : <i className="fa-solid fa-thumbtack" style={{color: "Tomato"}} onClick={() => dispatch.methods.pins.unpin(id, channelId)} />}
      { isMe && <i className='fa-solid fa-trash-can' onClick={() => setView('delete')} /> }
      {
        !stream.parentId
          && <i className="fa-solid fa-reply"
            onClick={() => dispatch.actions.stream.open({id: 'side', value: { type: 'live', channelId, parentId: id }})}
          />
      }
    </Container>
  );
};
