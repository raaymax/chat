import { h } from 'preact';
import styled from 'styled-components';
import { useState, useCallback } from 'preact/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { removeMessage } from '../services/messages';
import { pinMessage, unpinMessage } from '../services/pins';
import { Reaction } from './messages/reaction';

const ToolbarContainer = styled.div`
  position: absolute;
  top: -15px;
  height: 32px;
  right: 10px;
  z-index: 1000;
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

  i:hover {
    background-color: var(--primary_active_mask);
  }

  i:active {
    background-color: var(--secondary_active_mask);
  }
`;

export const Toolbar = ({message, user}) => {
  const {id, pinned, channel} = message;
  const [view, setView] = useState(null);
  const dispatch = useDispatch();
  const onDelete = useCallback(() => {
    dispatch(removeMessage({id}));
  }, [dispatch, id]);
  const meId = useSelector((state) => state.users.meId);
  const isMe = user.id === meId;

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
        ? <i class="fa-solid fa-thumbtack" onClick={() => dispatch(pinMessage(id, channel))} />
        : <i class="fa-solid fa-thumbtack" style="color:Tomato" onClick={() => dispatch(unpinMessage(id, channel))} />}
      { isMe && <i class='fa-solid fa-trash-can' onclick={() => setView('delete')} /> }
    </ToolbarContainer>
  );
}
