import { h } from 'preact';
import { useState, useCallback } from 'preact/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { formatTime, formatDate } from '../utils.js';
import Emojis from '../services/emoji';
import {resend} from '../services/messages';
import { Files } from './Files/Files';
import { Delete } from './confirm';
import { removeMessage } from '../services/messages';
import { selectors, actions } from '../state';

const EMOJI_MATCHER = () => /^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])+$/g;

const build = (datas) => [datas].flat().map((data, idx) => {
  if (!data) return;
  if (typeof data === 'string') return data;
  const key = Object.keys(data).find((f) => TYPES[f]);
  if (!key) {
    return `Unknown part: ${JSON.stringify(data)}`;
  }
  const Type = TYPES[key];
  return <Type key={idx} data={data[key]} />;
});

const TYPES = {
  bullet: (props) => <ul>{build(props.data)}</ul>,
  ordered: (props) => <ol>{build(props.data)}</ol>,
  item: (props) => <li>{build(props.data)}</li>,
  codeblock: (props) => <pre>{build(props.data)}</pre>,
  blockquote: (props) => <blockquote>{build(props.data)}</blockquote>,
  code: (props) => <code>{build(props.data)}</code>,
  line: (props) => <p>{build(props.data)}<br /></p>,
  br: () => <br />,
  text: (props) => props.data,
  bold: (props) => <b>{build(props.data)}</b>,
  italic: (props) => <em>{build(props.data)}</em>,
  underline: (props) => <u>{build(props.data)}</u>,
  strike: (props) => <s>{build(props.data)}</s>,
  link: (props) => <a target="_blank" rel="noreferrer" href={props.data.href}>{build(props.data.children)}</a>,
  emoji: (props) => {
    const emoji = Emojis.find((e) => e.name === props.data);
    if (!emoji) return `:${props.data}:`;
    return String.fromCodePoint(parseInt(emoji.unicode, 16));
  },
};

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

export const Message = (props = {}) => {
  const {
    clientId, info, message, attachments, flat, createdAt, userId,
  } = props.data;
  const [toolbar, setToolbar] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(selectors.getUser(userId));
  const meId = useSelector((state) => state.users.meId);
  const onAction = useCallback(() => {
    if (info.action === 'resend') {
      dispatch(resend(clientId));
    }
  }, [dispatch, clientId, info]);

  const onDelete = useCallback(() => {
    dispatch(removeMessage(props.data));
  }, [dispatch, props.data]);

  const isMe = user.id === meId;
  return (
    <div
      {...props}
      class={['message', ...props.class].join(' ')}
      onmouseenter={() => setToolbar(true)}
      onmouseleave={() => setToolbar(false)}
    >
      {!props.sameUser
        ? <div class='avatar'>{user.avatarUrl && <img src={user.avatarUrl} />}</div>
        : <div class='spacy side-time'>{formatTime(createdAt)}</div>
      }
      <div class='body'>
        {!props.sameUser && <div class='header'>
          <span class='author'>{user.name || 'Guest'}</span>
          <span class='spacy time'>{formatTime(createdAt)}</span>
          {!isToday(createdAt) && <span class='spacy time'>{formatDate(createdAt)}</span>}
        </div>}
        <div class={['content', ...(isOnlyEmoji(message, flat) ? ['emoji'] : [])].join(' ')}>{build(message)}</div>
        {attachments && <Files list={attachments} />}
        {info && <div onclick={onAction} class={['info', info.type, ...(info.action ? ['action'] : [])].join(' ')}>{info.msg}</div>}
        {isMe && toolbar && <div class='toolbar'>
          {/* <i class='fa-solid fa-icons' /> */}
          { isMe && <Delete accept={onDelete} />}
        </div>}
      </div>
    </div>
  );
};
