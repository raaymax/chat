import { h } from 'preact';
import styled from 'styled-components';
import { useState, useCallback, useEffect } from 'preact/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { removeMessage } from '../../../services/messages';
import { pinMessage, unpinMessage } from '../../../services/pins';
import { Reaction } from './reaction';
import { setStream } from '../../../services/stream';
import { useHovered } from '../../../contexts/conversation';
import { useStream } from '../../../contexts/stream';
import { useMessageData, useMessageUser } from '../../../contexts/message';

const ToolbarContainer = styled.div`
  position: absolute;
  top: -15px;
  height: 32px;
  right: 10px;
  z-index: 50;
  background-color: var(--primary_background);
  border: 1px solid #565856;
  border-radius: 0.3em;
  padding: 1px 5px;
  font-size: 0.9em;


  i {
    padding: 2px 5px;
    line-height: 24px;
    width: 24px;
    text-align: center;
    vertical-align: middle;
    display: inline;
    font-style: normal;
    cursor: pointer;
    border-radius: 0.2em;
  }

  body.mobile & {
    width: 100%;
    top: -50px;
    right: 0;
    border-radius: 0;
    border-top: 1px solid #565856;
    border-bottom: 1px solid #565856;
    border-left: 0;
    border-right: 0;
    margin: 0;
    padding: 0;
    height: 50px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    i {
      flex: 0 50px;
      line-height: 50px;
      font-size: 25px;

    }
  }

  i:hover {
    background-color: var(--primary_active_mask);
  }

  i:active {
    background-color: var(--secondary_active_mask);
  }
`;

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

  if (view === 'reactions') {
    return (
      <ToolbarContainer>
        <Reaction messageId={id}>♥️</Reaction>
        <Reaction messageId={id}>🤣</Reaction>
        <Reaction messageId={id}>👍</Reaction>
        <Reaction messageId={id}>👎</Reaction>
        <Reaction messageId={id}>🎉</Reaction>
        <Reaction messageId={id}>👀</Reaction>
      </ToolbarContainer>
    );
  }

  if (view === 'delete') {
    return (
      <ToolbarContainer>
        <i class='fa-solid fa-circle-check danger' onclick={onDelete} />
        <i class='fa-solid fa-circle-xmark' onclick={() => setView(null)} />
      </ToolbarContainer>
    );
  }

  return (
    <ToolbarContainer>
      <i class="fa-solid fa-icons" onClick={() => setView('reactions')} />
      {!pinned
        ? <i class="fa-solid fa-thumbtack" onClick={() => dispatch(pinMessage(id, channelId))} />
        : <i class="fa-solid fa-thumbtack" style="color:Tomato" onClick={() => dispatch(unpinMessage(id, channelId))} />}
      { isMe && <i class='fa-solid fa-trash-can' onclick={() => setView('delete')} /> }
      {
        !stream.parentId && <i class="fa-solid fa-reply" onClick={() => dispatch(setStream('side', {type: 'live', channelId, parentId: id}))} />
      }
    </ToolbarContainer>
  );
}
