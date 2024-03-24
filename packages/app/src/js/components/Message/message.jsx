import { formatTime, formatDateDetailed } from '../../utils';
import { Files } from '../Files/Files';
import { Reactions } from '../Reaction/Reaction';
import { MessageToolbar } from '../MessageToolbar/MessageToolbar';
import { Progress } from './elements/Progress';
import { Info } from './info';
import { ThreadInfo } from './threadInfo';
import { MessageContext, useMessageData, useMessageUser } from '../../contexts/message';
import { useHoverCtrl } from '../../contexts/hover';
import { useStream } from '../../contexts/stream';
import { buildMessageBody } from './messageBuilder';
import { isToday } from './utils';
import { LinkPreviewList } from './elements/LinkPreview';
import {Input} from '../Input/Input';
import PropTypes from 'prop-types';

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
        <Progress progress={msg.progress} />
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
  <MessageContext value={{ data: props.data }}>
    <MessageBase {...props} />
  </MessageContext>
);

Message.propTypes = {
  data: PropTypes.object,
};
