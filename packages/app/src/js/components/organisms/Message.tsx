import { useCallback } from 'react';
import styled from 'styled-components';
import { useActions, useDispatch } from '../../store';

import { resend } from '../../services/messages';

import { LinkPreviewList } from '../atoms/LinkPreview';
import { ReadReceipt } from '../atoms/ReadReceipt';
import { UserCircle } from '../atoms/UserCircle';
import { buildMessageBody } from '../molecules/MessageBody';
import { Files } from '../molecules/Files';
import { Reactions } from '../molecules/Reactions';
import { MessageToolbar } from '../molecules/MessageToolbar';
import { Input } from './Input';

import { MessageProvider } from '../contexts/message';
import { useMessageData } from '../contexts/useMessageData';
import { useMessageUser } from '../contexts/useMessageUser';
import { useHoverCtrl } from '../contexts/useHoverCtrl';
import { useStream } from '../contexts/useStream';

import {
  cn, ClassNames, formatTime, formatDateDetailed,
} from '../../utils';

import { Message as MessageType } from '../../types';

export const Info = () => {
  const { clientId, info } = useMessageData();
  const dispatch = useDispatch();

  const onAction = useCallback(() => {
    if (info?.action === 'resend') {
      dispatch(resend(clientId));
    }
  }, [dispatch, clientId, info]);

  if (!info) return null;
  return (
    <div onClick={onAction} className={['info', info.type, ...(info.action ? ['action'] : [])].join(' ')}>
      {info.msg}
    </div>
  );
};

const isToday = (date: string): boolean => {
  const someDate = new Date(date);
  const today = new Date();
  return someDate.getDate() === today.getDate()
    && someDate.getMonth() === today.getMonth()
    && someDate.getFullYear() === today.getFullYear();
};

const Container = styled.div`
  width: auto;
  display: inline-block;
  padding: 1px 11px;
  span {
    padding-left: 5px;
  }

  .replies {
    color: ${(props) => props.theme.linkColor};
  }
  .date {
    font-size: 0.7em;
    font-weight: 300;
  }
  cursor: pointer;
  &:hover {
    padding: 0px 10px;
    border: 1px solid ${(props) => props.theme.borderColor};
    border-radius: 4px;
    background-color: ${(props) => props.theme.frontHoverColor};
  }
`;

export const ThreadInfo = () => {
  const msg = useMessageData();
  const dispatch = useDispatch();
  const actions = useActions();
  const [stream] = useStream();
  const {
    updatedAt, thread, channelId, id,
  } = msg;
  if (!thread || stream.parentId) return null;
  return (
    <Container onClick={() => dispatch(actions.stream.open({ id: 'side', value: { type: 'live', channelId, parentId: id } }))}>
      {[...new Set(thread.map((t) => t.userId))]
        .map((userId) => (
          <UserCircle key={userId} userId={userId} />
        ))}
      <span className='replies'>
        {thread.length} {thread.length > 1 ? 'replies' : 'reply'}
      </span>
      <span className='date'>
        {formatTime(updatedAt)} on {formatDateDetailed(updatedAt)}
      </span>
    </Container>
  );
};

type MessageBaseProps = {
  onClick?: (e?: React.MouseEvent) => void;
  sameUser?: boolean;
  className?: ClassNames;
  [key: string]: unknown;
};

const MessageBase = ({ onClick, sameUser, ...props }: MessageBaseProps = {}) => {
  const msg = useMessageData();
  const {
    id, message, emojiOnly,
    createdAt, pinned,
    editing,
    linkPreviews,
  } = msg;
  const { onEnter, toggleHovered, onLeave } = useHoverCtrl(msg.id);
  const [{ selected }] = useStream();
  const user = useMessageUser();

  return (
    <div
      onClick={(e) => {
        toggleHovered();
        if (onClick) onClick(e);
      }}
      {...props}
      className={cn('message', {
        pinned,
        selected: selected === id,
      }, props.className)}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {!sameUser
        ? <div className='avatar'>{user?.avatarUrl && <img src={user?.avatarUrl} alt='avatar' />}</div>
        : <div className='spacy side-time'>{formatTime(createdAt)}</div>
      }
      <div className='body'>
        {!sameUser && <div className='header'>
          <span className='author'>{user?.name || 'Guest'}</span>
          <span className='spacy time'>{formatTime(createdAt)}</span>
          {!isToday(createdAt) && <span className='spacy time'>{formatDateDetailed(createdAt)}</span>}
        </div>}
        {editing
          ? <Input mode='edit' messageId={id}>{buildMessageBody(message, { emojiOnly })}</Input>
          : <div className={['content'].join(' ')}>
            {buildMessageBody(message, { emojiOnly })}
          </div>
        }

        <Files list={msg.attachments || []} />
        <LinkPreviewList links={linkPreviews} />
        <Info />
        <Reactions />
        <ThreadInfo />
        <ReadReceipt data={msg.progress} />
        <MessageToolbar />
      </div>
    </div>
  );
};

type MessageProps = MessageBaseProps & {
  data: MessageType;
};

export const Message = ({ data, ...props }: MessageProps) => (
  <MessageProvider value={data}>
    <MessageBase {...props} />
  </MessageProvider>
);
