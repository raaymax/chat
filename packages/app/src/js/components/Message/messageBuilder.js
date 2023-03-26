import { h } from 'preact';
import {Emoji} from '../Emoji/Emoji';
import {Link} from './Link';
import { ChannelInline } from '../channelInline/channelInline';
import { ThreadLink } from './threadInfo';

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
    : <Link href={props.data.href}>{build(props.data.children)}</Link>),
  emoji: (props) => <Emoji big={props.opts.emojiOnly} shortname={props.data} />,
  channel: (props) => <ChannelInline channelId={props.data} />,
  thread: (props) => <ThreadLink
    channelId={props.data.channelId}
    parentId={props.data.parentId}
    text={props.data.text} />,
};

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

export const buildMessageBody = (...args) => build(...args);
