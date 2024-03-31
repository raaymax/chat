import { formatTime, formatDateDetailed } from '../../utils';
import { Info } from './info';
import { ThreadInfo } from './threadInfo';
import { MessageContext, useMessageData, useMessageUser } from '../../contexts/message';
import { useHoverCtrl } from '../../contexts/hover';
import { useStream } from '../../contexts/stream';
import { isToday } from './utils';
import {Input} from '../Input/Input';
import PropTypes from 'prop-types';

import { LinkPreviewList } from '../../atomic/atoms/LinkPreview';
import { ReadReceipt } from '../../atomic/atoms/ReadReceipt';
import { buildMessageBody } from '../../atomic/molecules/MessageBody';
import { Files } from '../../atomic/molecules/Files';
import { MessageToolbar } from '../../atomic/molecules/MessageToolbar';
import { Reactions } from '../../atomic/molecules/Reactions';

const MessageBase = ({ onClick, sameUser, ...props } = {}) => {
  const msg = useMessageData();
  const {
    id, message, emojiOnly,
    createdAt, pinned,
    editing,
    linkPreviews,
  } = msg;
  const { onEnter, toggleHovered, onLeave } = useHoverCtrl(id);
  const [{ selected }] = useStream();
  const user = useMessageUser();

  return (
    <div
      onClick={(e) => {
        toggleHovered();
        if (onClick) onClick(e);
      }}
      {...props}
      className={['message', (pinned ? 'pinned' : ''), (selected === id ? 'selected' : ''), ...props.className].join(' ')}
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

MessageBase.propTypes = {
  onClick: PropTypes.func,
  sameUser: PropTypes.bool,
  className: PropTypes.arrayOf(PropTypes.string),
};

export const Message = (props) => (
  <MessageContext value={props.data}>
    <MessageBase {...props} />
  </MessageContext>
);

Message.propTypes = {
  data: PropTypes.object,
};
