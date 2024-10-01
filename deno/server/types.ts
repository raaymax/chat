import * as v from "valibot";

export class EntityId {
  constructor(public value: string) {}

  static from(id: string | EntityId) {
    if (id instanceof EntityId) {
      return new EntityId(id.toString());
    } else if (typeof id === "string") {
      return new EntityId(id);
    } else {
      console.log(id);
      throw new Error("Invalid id type");
    }
  }

  eq(id: EntityId) {
    return this.value === id.value;
  }

  neq(id: EntityId) {
    return this.value !== id.value;
  }

  toString() {
    return this.value;
  }
}

export type Config = {
  appVersion: string;
  mainChannelId: EntityId;
  vapidPublicKey: string;
};

export type Webhook = {
  url: string;
  events?: string[];
};

export type Session = {
  id: EntityId;
  expires: Date;
  userId: EntityId;
  token: string;
  lastIp: string;
  lastUserAgent: string;
};

export type User = {
  id: EntityId;
  alias: string | null;
  login: string;
  password: string;
  name: string;
  avatarFileId: string;
  mainChannelId: EntityId;
};

export enum ChannelType {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
  DIRECT = "DIRECT",
}

export type Channel = {
  id: EntityId;
  channelType: ChannelType;
  name: string;
  cid: string;
  private: boolean;
  direct: boolean;
  users: EntityId[];
};

// Replaces all EntityId with string recursively
export type ReplaceEntityId<T> = T extends EntityId ? string : (
  T extends object ? {
      [K in keyof T]: ReplaceEntityId<T[K]>;
    }
    : (
      T extends any[] ? ReplaceEntityId<T[number]>[] : T
    )
);

export type Emoji = {
  id: EntityId;
  shortname: string;
  fileId: string;
};

export type Badge = {
  id: EntityId;
  count: number;
  channelId: EntityId;
  parentId: EntityId | null;
  userId: EntityId;
  lastRead: Date;
  lastMessageId: EntityId;
};

export type Invitation = {
  id: EntityId;
  token: string;
  userId: EntityId;
  createdAt: Date;
};

export type MessageBodyBullet = { bullet: MessageBody };
export type MessageBodyOrdered = { ordered: MessageBody };
export type MessageBodyItem = { item: MessageBody };
export type MessageBodyCodeblock = { codeblock: string };
export type MessageBodyBlockquote = { blockquote: MessageBody };
export type MessageBodyCode = { code: string };
export type MessageBodyLine = { line: MessageBody };
export type MessageBodyBr = { br: boolean };
export type MessageBodyText = { text: string };
export type MessageBodyBold = { bold: MessageBody };
export type MessageBodyItalic = { italic: MessageBody };
export type MessageBodyUnderline = { underline: MessageBody };
export type MessageBodyStrike = { strike: MessageBody };
export type MessageBodyImg = { img: { src: string; alt: string } };
export type MessageBodyLink = { link: { href: string; children: MessageBody } };
export type MessageBodyEmoji = { emoji: string };
export type MessageBodyChannel = { channel: string };
export type MessageBodyUser = { user: string };
export type MessageBodyThread = {
  thread: { channelId: string; parentId: string; text: string };
};

export type MessageBodyPart =
  | MessageBodyBullet
  | MessageBodyOrdered
  | MessageBodyItem
  | MessageBodyCodeblock
  | MessageBodyBlockquote
  | MessageBodyCode
  | MessageBodyLine
  | MessageBodyBr
  | MessageBodyText
  | MessageBodyBold
  | MessageBodyItalic
  | MessageBodyUnderline
  | MessageBodyStrike
  | MessageBodyImg
  | MessageBodyLink
  | MessageBodyEmoji
  | MessageBodyChannel
  | MessageBodyUser
  | MessageBodyThread;

export type MessageBody = MessageBodyPart[] | MessageBodyPart;

export type Message = {
  id: EntityId;
  flat: string;
  message: MessageBody;
  channelId: EntityId;
  userId: EntityId;
  parentId: EntityId;
  channel: string;
  clientId: string;
  emojiOnly: boolean;
  pinned: boolean;
  thread: Array<{
    userId: EntityId;
    childId: EntityId;
  }>;
  reactions: Array<{
    userId: EntityId;
    reaction: string;
  }>;
  links: string[];
  mentions: string[];
  linkPreviews: {
    url: string;
    title: string;
    siteName: string;
    description: string;
    mediaType: string;
    contentType: string;
    images: string[];
    videos: string[];
    favicons: string[];
    charset: string;
  }[];
  parsingErrors: any[];
  attachments: Array<{ // TODO make this a separate entity
    id: string;
    fileName: string;
    contentType: string;
  }>;
  updatedAt: Date;
  createdAt: Date;
};

export const vMessageBodyPart: v.GenericSchema<MessageBodyPart> = v.union([
  v.object({ bullet: v.lazy(() => vMessageBody) }),
  v.object({ ordered: v.lazy(() => vMessageBody) }),
  v.object({ item: v.lazy(() => vMessageBody) }),
  v.object({ codeblock: v.string() }),
  v.object({ blockquote: v.lazy(() => vMessageBody) }),
  v.object({ code: v.string() }),
  v.object({ line: v.lazy(() => vMessageBody) }),
  v.object({ br: v.boolean() }),
  v.object({ text: v.string() }),
  v.object({ bold: v.lazy(() => vMessageBody) }),
  v.object({ italic: v.lazy(() => vMessageBody) }),
  v.object({ underline: v.lazy(() => vMessageBody) }),
  v.object({ strike: v.lazy(() => vMessageBody) }),
  v.object({ img: v.object({ src: v.string(), alt: v.string() }) }),
  v.object({
    link: v.object({ href: v.string(), children: v.lazy(() => vMessageBody) }),
  }),
  v.object({ emoji: v.string() }),
  v.object({ channel: v.string() }),
  v.object({ user: v.string() }),
  v.object({
    thread: v.object({
      channelId: v.string(),
      parentId: v.string(),
      text: v.string(),
    }),
  }),
]);

export const vMessageBody: v.GenericSchema<MessageBody> = v.union([
  v.array(vMessageBodyPart),
  vMessageBodyPart,
]);

export type ReplaceType<T, R, W> = T extends R ? W : (
  T extends object ? {
      [K in keyof T]: ReplaceType<T[K], R, W>;
    }
    : (
      T extends any[] ? ReplaceType<T[number], R, W>[] : T
    )
);

export const Id = v.pipe(
  v.string(),
  v.transform((i: string) => EntityId.from(i)),
);

/*
export const vMessage: v.GenericSchema<Message, ReplaceType<Partial<Message>, EntityId, string>> = v.object({
  flat: v.string(),
  message: vMessageBody,
  channelId: Id,
  userId: Id,
  parentId: Id,
  channel: v.string(),
  clientId: v.string(),
  emojiOnly: v.boolean(),
  pinned: v.boolean(),
  links: v.array(v.string()),
  attachments: v.array(v.object({
    id: v.string(),
    fileName: v.string(),
    contentType: v.optional(v.string(), "application/octet-stream"),
  })),
});
*/
