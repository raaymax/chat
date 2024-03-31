import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeMessage } from '../../services/messages';
import { useHovered } from '../../contexts/hover';
import { useStream } from '../../contexts/stream';
import { useMessageData, useMessageUser } from '../../contexts/message';
import { Toolbar } from '../../atomic/atoms/Toolbar';
import { ButtonWithEmoji } from '../../atomic/molecules/ButtonWithEmoji';
import { ButtonWithIcon } from '../../atomic/molecules/ButtonWithIcon';

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
  const [view, setView] = useState<string | null>(null);
  const dispatch: any = useDispatch();
  const [stream] = useStream();
  const onDelete = useCallback(() => {
    dispatch(removeMessage({ id }));
  }, [dispatch, id]);

  const meId = useSelector((state: any) => state.me);
  const isMe = user?.id === meId;
  const [hovered] = useHovered();

  useEffect(() => setView(null), [hovered]);

  if (hovered !== id) return null;

  const reaction = (emoji: string) => (
    <ButtonWithEmoji 
      key={emoji}
      emoji={emoji}
      onClick={() => dispatch.methods.messages.addReaction(id, emoji)} />
  );
  const deleteButton = () => <ButtonWithIcon key='del' icon="delete" onClick={() => setView('delete')} />;
  const confirmDelete = () => <ButtonWithIcon key='confirm_del' icon="check:danger" onClick={onDelete} />;
  const cancelButton = () => <ButtonWithIcon key='cancel' icon="circle-xmark" onClick={() => setView(null)} />;
  const editButton = () => <ButtonWithIcon key='edit' icon="edit" onClick={() => dispatch.actions.messages.toggleEdit(id)} />;
  const openReactions = () => <ButtonWithIcon key='reactions' icon="icons" onClick={() => setView('reactions')} />;
  const pinButton = () => <ButtonWithIcon key='pin' icon="thumbtack" onClick={() => dispatch.methods.pins.pin(id, channelId)} />;
  const unpinButton = () => <ButtonWithIcon key='unpin' icon="thumbtack" onClick={() => dispatch.methods.pins.unpin(id, channelId)} />;
  const replyButton = () => <ButtonWithIcon key='reply' icon="reply" onClick={() => dispatch.actions.stream.open({ id: 'side', value: { type: 'live', channelId, parentId: id } })} />;

  return (
    <Container>
      <Toolbar size={40}>
        {view == 'reactions' && [
          ':heart:',
          ':rofl:',
          ':thumbsup:',
          ':thumbsdown:',
          ':tada:',
          ':eyes:',
        ].map(reaction)}
        {view == 'delete' && [
          confirmDelete(),
          cancelButton(),
        ]}
        {view == null && [
          openReactions(),
          isMe && editButton(),
          isMe && deleteButton(),
          pinned ? unpinButton() : pinButton(),
          !stream.parentId && replyButton(),
        ]}
        
      </Toolbar>
    </Container>
  );
};
