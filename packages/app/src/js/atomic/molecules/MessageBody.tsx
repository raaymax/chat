import { Emoji } from './Emoji';
import { Link } from '../atoms/Link';
import { ChannelLink } from './ChannelLink';
import { UserMention } from './UserMention';
import { ThreadLink } from './ThreadLink';
import * as types from '../../types';


function is<T extends types.MessageBodyPart>(data: types.MessageBodyPart, key: string): data is T {
  return (data as T)[key as keyof T] !== undefined;
}

const build = (data: types.MessageBody, opts: {emojiOnly?: boolean} = {}): JSX.Element => {
  // FIXME: sanity check
  if (!data || typeof data === 'string') return data;
  if(Array.isArray(data)) {
    return <>{data.map((o) => build(o, opts))}</>;
  }
  if(is<types.MessageBodyBullet>(data, 'bullet')) return <ul>{build(data.bullet)}</ul>;
  if(is<types.MessageBodyOrdered>(data, 'ordered')) return <ol>{build(data.ordered)}</ol>;
  if(is<types.MessageBodyItem>(data, 'item')) return <li>{build(data.item)}</li>;
  if(is<types.MessageBodyCodeblock>(data, 'codeblock')) return <pre>{data.codeblock}</pre>;
  if(is<types.MessageBodyBlockquote>(data, 'blockquote')) return <blockquote>{build(data.blockquote)}</blockquote>;
  if(is<types.MessageBodyCode>(data, 'code')) return <code>{data.code}</code>;
  if(is<types.MessageBodyLine>(data, 'line')) return <p>{build(data.line)}<br /></p>;
  if(is<types.MessageBodyBr>(data, 'br')) return <br />;
  if(is<types.MessageBodyText>(data, 'text')) return <>{data.text}</>;
  if(is<types.MessageBodyBold>(data, 'bold')) return <b>{build(data.bold)}</b>;
  if(is<types.MessageBodyItalic>(data, 'italic')) return <em>{build(data.italic)}</em>;
  if(is<types.MessageBodyUnderline>(data, 'underline')) return <u>{build(data.underline)}</u>;
  if(is<types.MessageBodyStrike>(data, 'strike')) return <s>{build(data.strike)}</s>;
  if(is<types.MessageBodyImg>(data, 'img')) return <img src={data.img.src} alt={data.img.alt} />;
  if(is<types.MessageBodyLink>(data, 'link')) return <Link href={data.link.href}>{build(data.link.children)}</Link>;
  if(is<types.MessageBodyEmoji>(data, 'emoji')) return <Emoji size={opts?.emojiOnly ? 40 : undefined} shortname={data.emoji} />;
  if(is<types.MessageBodyChannel>(data, 'channel')) return <ChannelLink channelId={data.channel} />;
  if(is<types.MessageBodyUser>(data, 'user')) return <UserMention userId={data.user} />;
  if(is<types.MessageBodyThread>(data, 'thread')) return <ThreadLink channelId={data.thread.channelId} parentId={data.thread.parentId} text={data.thread.text} />;
  return <>Unknown part: {JSON.stringify(data)}</>;
}

export const buildMessageBody = build;
