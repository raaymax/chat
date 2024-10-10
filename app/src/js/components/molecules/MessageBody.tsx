import React from 'react';
import { Emoji } from './Emoji';
import { Link } from '../atoms/Link';
import { ChannelLink } from './ChannelLink';
import { UserMention } from './UserMention';
import { ThreadLink } from './ThreadLink';
import { ActionButton } from '../atoms/ActionButton';
import * as types from '../../types';

function is<T extends types.MessageBodyPart>(data: types.MessageBodyPart, key: string): data is T {
  return (data as T)[key as keyof T] !== undefined;
}

const build = (
  data: types.MessageBody,
  opts: {emojiOnly?: boolean} = {},
  key: string | number | undefined = undefined,
): React.ReactNode => {
  // FIXME: sanity check
  if (!data || typeof data === 'string') return data;
  if (Array.isArray(data)) {
    return <React.Fragment key={key}>{data.map((o, idx) => build(o, opts, idx))}</React.Fragment>;
  }
  if (is<types.MessageBodyBullet>(data, 'bullet')) return <ul key={key}>{build(data.bullet)}</ul>;
  if (is<types.MessageBodyOrdered>(data, 'ordered')) return <ol key={key}>{build(data.ordered)}</ol>;
  if (is<types.MessageBodyItem>(data, 'item')) return <li key={key}>{build(data.item)}</li>;
  if (is<types.MessageBodyCodeblock>(data, 'codeblock')) return <pre key={key}>{data.codeblock}</pre>;
  if (is<types.MessageBodyBlockquote>(data, 'blockquote')) return <blockquote key={key}>{build(data.blockquote)}</blockquote>;
  if (is<types.MessageBodyCode>(data, 'code')) return <code key={key}>{data.code}</code>;
  if (is<types.MessageBodyLine>(data, 'line')) return <p key={key}>{build(data.line)}<br /></p>;
  if (is<types.MessageBodyBr>(data, 'br')) return <br key={key} />;
  if (is<types.MessageBodyText>(data, 'text')) return <React.Fragment key={key}>{data.text}</React.Fragment>;
  if (is<types.MessageBodyBold>(data, 'bold')) return <b key={key}>{build(data.bold)}</b>;
  if (is<types.MessageBodyItalic>(data, 'italic')) return <em key={key}>{build(data.italic)}</em>;
  if (is<types.MessageBodyUnderline>(data, 'underline')) return <u key={key}>{build(data.underline)}</u>;
  if (is<types.MessageBodyStrike>(data, 'strike')) return <s key={key}>{build(data.strike)}</s>;
  if (is<types.MessageBodyImg>(data, 'img')) return <img key={key} src={data.img.src} alt={data.img.alt} />;
  if (is<types.MessageBodyLink>(data, 'link')) return <Link key={key} href={data.link.href}>{build(data.link.children)}</Link>;
  if (is<types.MessageBodyEmoji>(data, 'emoji')) return <Emoji key={key} size={opts?.emojiOnly ? 40 : 32} shortname={data.emoji} />;
  if (is<types.MessageBodyChannel>(data, 'channel')) return <ChannelLink key={key} channelId={data.channel} />;
  if (is<types.MessageBodyUser>(data, 'user')) return <UserMention key={key} userId={data.user} />;
  if (is<types.MessageBodyThread>(data, 'thread')) return <ThreadLink key={key} channelId={data.thread.channelId} parentId={data.thread.parentId} text={data.thread.text} />;
  if (is<types.MessageBodyButton>(data, 'button')) return <ActionButton key={key} action={data.button.action} style={data.button.style} payload={data.button.payload}>{data.button.text}</ActionButton>
  return <>Unknown part: {JSON.stringify(data)}</>;
};

export const buildMessageBody = build;
