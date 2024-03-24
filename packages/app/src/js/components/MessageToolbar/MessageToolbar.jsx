import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeMessage } from '../../services/messages';
import { useHovered } from '../../contexts/hover';
import { useStream } from '../../contexts/stream';
import { useMessageData, useMessageUser } from '../../contexts/message';
import { Toolbar } from '../../atomic/organisms/Toolbar';

import styled from 'styled-components';

export const Container = styled.div`
  position: absolute;
  top: -15px;
  height: 42px;
  right: 10px;
  z-index: 50;
  background-color: var(--primary_background);
  border: 1px solid #565856;
  border-radius: 0.3em;
  padding: 0px;
  font-size: 0.9em;
  box-sizing: border-box;

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
`;

export const MessageToolbar = () => {
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

  const reaction = (emoji) => ({ 
    emoji, 
    handler: () => dispatch.methods.messages.addReaction(id, emoji)
  });

  const deleteButton = () => ({
    icon: 'fa-solid fa-trash-can',
    handler: () => setView('delete')
  });

  const confirmDelete = () => ({
    icon: 'fa-solid fa-circle-check danger',
    handler: onDelete,
  });

  const cancelButton = () => ({
    icon: 'fa-solid fa-circle-xmark',
    handler: () => setView(null)
  });

  const editButton = () => ({
    icon: 'fa-solid fa-pen-to-square',
    handler: () => dispatch.actions.messages.toggleEdit(id)
  });

  const openReactions = () => ({
    icon: 'fa-solid fa-icons',
    handler: () => setView('reactions')
  });

  const pinButton = () => ({
    icon: 'fa-solid fa-thumbtack',
    handler: () => dispatch.methods.pins.pin(id, channelId)
  });

  const unpinButton = () => ({
    icon: 'fa-solid fa-thumbtack',
    handler: () => dispatch.methods.pins.unpin(id, channelId)
  });

  const replyButton = () => ({
    icon: 'fa-solid fa-reply',
    handler: () => dispatch.actions.stream.open({ id: 'side', value: { type: 'live', channelId, parentId: id } })
  });

  return (
    <Container>
      <Toolbar opts={[
        ...(view == 'reactions' ? [
            reaction(':heart:'),
            reaction(':rofl:'),
            reaction(':thumbsup:'),
            reaction(':thumbsdown:'),
            reaction(':tada:'),
            reaction(':eyes:'),
        ]: []),
        ...(view == 'delete' ? [
          confirmDelete(),
          cancelButton(),
        ] : []),
        ...(view == null ? [
            openReactions(),
            isMe && editButton(),
            pinned ? unpinButton() : pinButton(),
            isMe && deleteButton(),
            !stream.parentId && replyButton(),
        ] : []),
      ]} />
    </Container>
  );
};
