import {h} from 'preact';
import { formatTime, formatDate } from '../utils.js';

const EMOJI_MATCHER = () => /^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])+$/g;

const build = (datas) => [datas].flat().map((data, idx) => {
  if (typeof data === 'string') return data;
  const key = Object.keys(data).find((f) => TYPES[f]);
  if (!key) {
    return `Unknown part: ${JSON.stringify(data)}`;
  }
  const Type = TYPES[key];
  return <Type key={idx} data={data[key]} />;
});

const TYPES = {
  bullet: (props) => <ul>${build(props.data)}</ul>,
  ordered: (props) => <ol>${build(props.data)}</ol>,
  item: (props) => <li>${build(props.data)}</li>,
  codeblock: (props) => <pre>${build(props.data)}</pre>,
  blockquote: (props) => <blockquote>${build(props.data)}</blockquote>,
  code: (props) => <code>${build(props.data)}</code>,
  line: (props) => <p>{build(props.data)}<br /></p>,
  br: () => <br />,
  text: (props) => props.data,
  bold: (props) => <b>${build(props.data)}</b>,
  italic: (props) => <em>${build(props.data)}</em>,
  underline: (props) => <u>${build(props.data)}</u>,
  strike: (props) => <s>${build(props.data)}</s>,
  link: (props) => <a href={props.data.href}>${build(props.data.children)}</a>,
  emoji: (props) => {
    const emoji = EMOJI.find((e) => e.name === props.data);
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
    info, message, flat, createdAt, user,
  } = props.data;
  return (
    <div {...props} class={['message', ...props.class].join(' ')}>
      {!props.sameUser
        ? <div class='avatar'>{user.avatarUrl && <img src={user.avatarUrl} />}</div>
        : <div class='spacy side-time'>{formatTime(createdAt)}</div>
      }
      <div class='body'>
        {!props.sameUser && <div class='header'>
          <span class='author'>{user.name || 'Guest'}</span>
          <span class='spacy time'>{formatTime(createdAt)}</span>
          {!isToday(createdAt) && <span class='spacy time'>${formatDate(createdAt)}</span>}
        </div>}
        <div class={['content', ...(isOnlyEmoji(message, flat) ? ['emoji'] : [])].join(' ')}>{build(message)}</div>
        {info && <div class={['info', info.type].join(' ')}>{info.msg}</div>}
      </div>
    </div>
  );
};
