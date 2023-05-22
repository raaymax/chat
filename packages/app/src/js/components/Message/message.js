import { h } from 'preact';
import { formatTime, formatDateDetailed } from '../../utils';
import { Files } from '../Files/Files';
import { Reactions } from '../Reaction/Reaction';
import { Toolbar } from '../Toolbar/Toolbar';
import { Progress } from './elements/Progress';
import { Info } from './info';
import { ThreadInfo } from './threadInfo';
import { MessageContext, useMessageData, useMessageUser } from '../../contexts/message';
import { useHoverCtrl } from '../../contexts/hover';
import { useStream } from '../../contexts/stream';
import { buildMessageBody } from './messageBuilder';
import { isToday } from './utils';
import { LinkPreviewList } from './elements/LinkPreview';

const MessageBase = ({onClick, ...props} = {}) => {
  const msg = useMessageData();
  const {
    id, message, emojiOnly,
    createdAt, pinned,
    linkPreviews,
  } = msg;
  const { onEnter, toggleHovered, onLeave } = useHoverCtrl(id);
  const [{selected}] = useStream();
  const user = useMessageUser();

  return (
    <div
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

        <Files list={msg.attachments} />
        <LinkPreviewList links={linkPreviews} />
        <Info />
        <Reactions />
        <ThreadInfo />
        <Progress progress={msg.progress} />
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
