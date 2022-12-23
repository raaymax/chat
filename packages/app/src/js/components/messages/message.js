import { h, Component} from 'preact';
import { useCallback } from 'preact/hooks';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { formatTime, formatDateDetailed } from '../../utils';
import { resend } from '../../services/messages';
import { Files } from '../Files/Files';
import { Reactions } from './reaction';
import { actions, selectors } from '../../state';
import { Toolbar } from './toolbar';
import {Emoji} from './Emoji';
import { Progress } from './progress';
import { InlineChannel } from '../channels';
import { ThreadInfo, ThreadLink } from './threadInfo';

const EMOJI_MATCHER = () => /^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])+$/g;

const build = (datas, opts = {}) => [datas].flat().map((data, idx) => {
  if (!data) return;
  if (typeof data === 'string') return data;
  const key = Object.keys(data).find((f) => TYPES[f]);
  if (!key) {
    return `Unknown part: ${JSON.stringify(data)}`;
  }
  const Type = TYPES[key];
  return <Type key={idx} data={data[key]} opts={opts} />;
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
  img: (props) => <img src={props.data.src} alt={props.data.alt} />,
  link: (props) => (props.data.href.startsWith('#')
    ? <InlineChannel cid={props.data.href.slice(1)} />
    : <a target="_blank" rel="noreferrer" href={props.data.href}>{build(props.data.children)}</a>),
  emoji: (props) => <Emoji big={props.opts.emojiOnly} shortname={props.data} />,
  channel: (props) => <InlineChannel channelId={props.data} />,
  thread: (props) => <ThreadLink channelId={props.data.channelId} parentId={props.data.parentId} text={props.data.text} />,
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
    id, clientId, info, message, reactions = [], emojiOnly,
    attachments, flat, createdAt, userId, pinned, progress, thread,
  } = props.data;
  const msg = props.data;
  const dispatch = useDispatch();
  const hovered = useSelector(selectors.getHoveredMessage);
  const user = useSelector(selectors.getUser(userId));
  const onAction = useCallback(() => {
    if (info.action === 'resend') {
      dispatch(resend(clientId));
    }
  }, [dispatch, clientId, info]);

  const onEnter = useCallback(() => {
    dispatch(actions.hoverMessage(id));
  }, [dispatch, id]);

  const onLeave = useCallback(() => {
    if (hovered === id) {
      dispatch(actions.hoverMessage(null));
    }
  }, [dispatch, hovered, id]);

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
        <div class={['content', ...(isOnlyEmoji(message, flat) ? ['big-emoji'] : [])].join(' ')}>{build(message, {emojiOnly})}</div>
        {attachments && <Files list={attachments} />}
        {info && <div onclick={onAction} class={['info', info.type, ...(info.action ? ['action'] : [])].join(' ')}>{info.msg}</div>}
        <Reactions messageId={id} reactions={reactions} />
        {thread && <ThreadInfo message={props.data} />}
        {progress && <Progress progress={progress} />}

        {hovered === id && <Toolbar message={props.data} user={user} />}
      </div>
    </div>
  );
};

export class MessageWrapper extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.id !== this.props.id;
  }

  render() {
    return <Message {...this.props} />;
  }
}
