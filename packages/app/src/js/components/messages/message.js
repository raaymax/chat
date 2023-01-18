import { h } from 'preact';
import { useCallback } from 'preact/hooks';
import { useDispatch } from 'react-redux';
import { formatTime, formatDateDetailed } from '../../utils';
import { resend } from '../../services/messages';
import { Files } from '../Files/Files';
import { Reactions } from './reaction';
import { Toolbar } from './toolbar';
import { Progress } from './progress';
import { ThreadInfo } from './threadInfo';
import {MessageContext, useMessageData, useMessageUser} from './messageContext';
import {useHovered} from './conversationContext';
import {useStream} from '../streamContext';
import {buildMessageBody} from './messageBuilder';

const EMOJI_MATCHER = () => /^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])+$/g;

const isToday = (date) => {
  const someDate = new Date(date);
  const today = new Date();
  return someDate.getDate() === today.getDate()
    && someDate.getMonth() === today.getMonth()
    && someDate.getFullYear() === today.getFullYear();
};

const isOnlyEmoji = (message, flat) => EMOJI_MATCHER().test(flat) || (
  message
  && message.length === 1
  && message[0].line
  && message[0].line.length === 1
  && message[0].line[0].emoji
);

const MessageBase = (props = {}) => {
  const msg = useMessageData();
  const {
    id, clientId, info, message, reactions = [], emojiOnly,
    attachments, flat, createdAt, pinned, progress, thread,
  } = msg;
  const dispatch = useDispatch();
  const [hovered, setHovered] = useHovered()
  const user = useMessageUser();
  const [stream] = useStream();
  const onAction = useCallback(() => {
    if (info.action === 'resend') {
      dispatch(resend(clientId));
    }
  }, [dispatch, clientId, info]);

  const onEnter = useCallback(() => {
    setHovered(id);
  }, [setHovered, id]);

  const onLeave = useCallback(() => {
    if (hovered === id) {
      setHovered(null);
    }
  }, [setHovered, hovered, id]);

  return (
    <div
      {...props}
      class={['message', (pinned ? 'pinned' : ''), ...props.class].join(' ')}
      onmouseenter={onEnter}
      onmouseleave={onLeave}
    >
      {!props.sameUser
        ? <div class='avatar'>{user.avatarUrl && <img src={user.avatarUrl} />}</div>
        : <div class='spacy side-time'>{formatTime(createdAt)}</div>
      }
      <div class='body'>
        {!props.sameUser && <div class='header'>
          <span class='author'>{user.name || 'Guest'}</span>
          <span class='spacy time'>{formatTime(createdAt)}</span>
          {!isToday(createdAt) && <span class='spacy time'>{formatDateDetailed(createdAt)}</span>}
        </div>}
        <div class={['content', ...(isOnlyEmoji(message, flat) ? ['big-emoji'] : [])].join(' ')}>{buildMessageBody(message, {emojiOnly})}</div>
        {attachments && <Files list={attachments} />}
        {info && <div onclick={onAction} class={['info', info.type, ...(info.action ? ['action'] : [])].join(' ')}>{info.msg}</div>}
        <Reactions />
        <ThreadInfo />
        {progress && <Progress progress={progress} />}

        {hovered === id && <Toolbar />}
      </div>
    </div>
  );
};

export const Message = (props) => (
  <MessageContext value={{data: props.data}}>
    <MessageBase {...props} />
  </MessageContext>
);
