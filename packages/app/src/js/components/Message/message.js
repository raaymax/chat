import { h } from 'preact';
import { useCallback } from 'preact/hooks';
import { formatTime, formatDateDetailed } from '../../utils';
import { Attachments } from './attachments';
import { Reactions } from './reaction';
import { Toolbar } from './toolbar';
import { Progress } from './progress';
import { Info } from './info';
import { ThreadInfo } from './threadInfo';
import { MessageContext, useMessageData, useMessageUser } from '../../contexts/message';
import { useHovered } from '../../contexts/conversation';
import { useStream } from '../../contexts/stream';
import { buildMessageBody } from './messageBuilder';
import { isToday } from './utils';
import { LinkPreviewList } from './elements/LinkPreview';

const MessageBase = (props = {}) => {
  const msg = useMessageData();
  const {
    id, message, emojiOnly,
    createdAt, pinned,
    linkPreviews,
  } = msg;
  const [hovered, setHovered] = useHovered()
  const [{selected}] = useStream();
  const user = useMessageUser();

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
          { buildMessageBody(message, { emojiOnly }) }
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
