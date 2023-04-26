import { h } from 'preact';
import { useCallback, useState, useRef, useEffect } from 'preact/hooks';
import { formatTime, formatDateDetailed } from '../../utils';
import { Attachments } from './attachments';
import { Reactions } from '../Reaction/Reaction';
import { Toolbar } from '../Toolbar/Toolbar';
import { Progress } from './progress';
import { Info } from './info';
import { ThreadInfo } from './threadInfo';
import { MessageContext, useMessageData, useMessageUser } from '../../contexts/message';
import { useHovered } from '../../contexts/hover';
import { useStream } from '../../contexts/stream';
import { useStreamIdx } from '../../contexts/messages';
import { buildMessageBody } from './messageBuilder';
import { isToday } from './utils';
import { LinkPreviewList } from './elements/LinkPreview';

const MessageBase = ({onClick, ...props} = {}) => {
  const ref = useRef();
  const msg = useMessageData();
  const [, setStreamIdx] = useStreamIdx();
  const {
    id, message, emojiOnly,
    createdAt, pinned,
    linkPreviews, streamIdx,
  } = msg;
  const [hovered, setHovered] = useHovered()
  const [{selected}] = useStream();
  const user = useMessageUser();

  const onEnter = useCallback(() => {
    setHovered(id);
  }, [setHovered, id]);

  const toggleHovered = useCallback(() => {
    if (!navigator.userAgentData.mobile) return;
    if (hovered !== id) {
      setHovered(id);
    } else {
      setHovered(null);
    }
  }, [hovered, setHovered, id]);

  const onLeave = useCallback(() => {
    if (hovered === id) {
      setHovered(null);
    }
  }, [setHovered, hovered, id]);

  useEffect(() => {
    const element = ref.current;
    const cb = () => {
      const c = element.parentElement.getBoundingClientRect();
      const e = element.getBoundingClientRect();
      if (e.y < c.height / 2 + 50 && (e.y + e.height) > c.height / 2 - 50) {
        setStreamIdx(streamIdx);
      }
    }
    element.parentElement.addEventListener('scroll', cb);
    return () => {
      element.parentElement.removeEventListener('scroll', cb);
    }
  }, [])

  return (
    <div
      ref={ref}
      onClick={(e) => {
        toggleHovered();
        if (onClick) onClick(e);
      }}
      {...props}
      class={['message', (pinned ? 'pinned' : ''), (selected === id ? 'selected' : ''), ...props.class].join(' ')}
      onmouseenter={onEnter}
      onmouseleave={onLeave}
    >
      {!props.sameUser
        ? <div class='avatar'>{user?.avatarUrl && <img src={user?.avatarUrl} alt='avatar' />}</div>
        : <div class='spacy side-time'>{formatTime(createdAt)}</div>
      }
      <div class='body'>
        {!props.sameUser && <div class='header'>
          <span class='author'>{user?.name || 'Guest'}</span>
          <span class='spacy time'>{formatTime(createdAt)}</span>
          {!isToday(createdAt) && <span class='spacy time'>{formatDateDetailed(createdAt)}</span>}
        </div>}
        <div class={['content'].join(' ')}>
          {buildMessageBody(message, { emojiOnly })}
        </div>

        <Attachments />
        <LinkPreviewList links={linkPreviews} />
        <Info />
        <Reactions />
        <ThreadInfo />
        <Progress />
        <Toolbar />
      </div>
    </div>
  );
};

export const Message = (props) => (
  <MessageContext value={{data: props.data}}>
    <MessageBase {...props} />
  </MessageContext>
);
