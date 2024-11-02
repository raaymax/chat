import { useCallback } from 'react';
import styled from 'styled-components';
import { useDispatch } from '../../store';

import { resend } from '../../services/messages';

import { ProfilePic } from '../atoms/ProfilePic';
import { LinkPreviewList } from '../atoms/LinkPreview';
import { ReadReceipt } from '../molecules/ReadReceipt';
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

import {
  cn, ClassNames, formatTime, formatDateDetailed, isToday
} from '../../utils';

import { Message as MessageType } from '../../types';
import { useMessageListArgs } from '../contexts/useMessageListArgs';
import { useNavigate } from 'react-router-dom';


const MessageContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  animation-duration: 1s;
  animation-iteration-count: 1;
  margin: 0;
  padding: 8px 16px 4px 16px;
  line-height: 24px;
  vertical-align: middle;

  &.short {
    padding-left: 0px;
    padding: 4px 16px 4px 16px;
  }

  .pins &.pinned {
    background-color: transparent;
  }
  &.pinned {
    background-color: rgb(from ${props => props.theme.PrimaryButton.Background} r g b / 10%);
  }

  &.pinned:hover {
    background-color: rgb(from ${props => props.theme.PrimaryButton.Background} r g b / 15%);
  }

  & i.reaction {
    background-color: var(--secondary_active_mask);
    border-radius: 10px;
    padding: 2px 5px;
    margin-right: 5px;
    border: 1px solid #565856;
    font-style: normal;
  }


  &.selected {
    background-color: ${(props) => props.theme.Chatbox.Selected};
  }

  .side-time {
    flex: 0 48px;
    width: 48px;
    min-width: 44px;
    color: transparent;
    font-weight: 200;
    font-size: .8em;
    text-align: center;
  }
  &:hover .side-time {
    color: ${(props) => props.theme.Labels};
  }

  & > .avatar {
    flex: 0 48px;
    margin: 0px;
    border-radius: 5px;
    overflow: hidden;
    min-width: 44px;
  }
  .avatar img {
    height: 100%;
    width: 100%;
  }

  &.private{
    border-left: 10px solid #a27321; 
  }

  .info {
    line-height: 16px;
    height: 16px;
    padding: 0px 0px;
    font-weight: 300;
    vertical-align: middle;
    font-size: .8em;
  }

  .header {
    height: 24px;
    --padding-top: 5px;
    --padding-bottom: 0px;
  }
  .author {
    font-size: 16px;
    font-weight: 500;
  }
  .time {
    color: ${({ theme }) => theme.Labels};
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
  }
  .content {
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
  }

  .content img {
    max-width: 300px;
    height: auto;
  }
  .content p{
    white-space: break-spaces;
    word-break: break-word;
  }
  .content.big-emoji {
    font-size: 30px;
    line-height: 35px;
  }
  .content.big-emoji .emoji {
    font-size: 30px;
    line-height: 35px;
  }
   .content.big-emoji .emoji  img !important {
    height: 3em;
    width: 3em;
  }
  .thread-info {
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
  }
  .body {
    flex: 1;
    padding: 0;
    padding-left: 16px;
    line-break: auto;
    hyphens: auto;
    width: calc(100% - 75px);
  }
  &.private .avatar {
    margin-left: 20px;
  }
  &:hover {
      background-color: ${(props) => props.theme.Chatbox.Message.Hover};
  }
`;

const Info = () => {
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

const ThreadInfo = () => {
  const msg = useMessageData();
  const navigate = useNavigate();
  const [args] = useMessageListArgs();
  const {
    updatedAt, thread, channelId, id,
  } = msg;
  if (!thread || args.id === 'side') return null;
  return (
    <div className="thread-info" onClick={() => {
      navigate(`/${channelId}/t/${id}`);
    }}>
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
    </div>
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
    userId,
    linkPreviews,
  } = msg;
  const { onEnter, toggleHovered, onLeave } = useHoverCtrl(msg.id);
  const [{ selected }] = useMessageListArgs();
  const user = useMessageUser();

  return (
    <MessageContainer
      onClick={(e) => {
        toggleHovered();
        if (onClick) onClick(e);
      }}
      {...props}
      className={cn('message', {
        pinned,
        short: sameUser,
        selected: selected === id,
      }, props.className)}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {!sameUser
        ? <ProfilePic type='regular' userId={userId} />
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
    </MessageContainer>
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
