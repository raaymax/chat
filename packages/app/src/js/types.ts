export type AppTheme = {
  borderColor: string;
  backgroundColor: string;
  highlightedBackgroundColor: string;
  inputBackgroundColor: string;
  dateBarBackgroundColor: string;
  fontColor: string;
  frontHoverColor: string;
  userActive: string;
  userConnected: string;
  userSystem: string;
  userDisconnected: string;
  actionButtonBackgroundColor: string;
  actionButtonHoverBackgroundColor: string;
  actionButtonActiveBackgroundColor: string;
  actionButtonFontColor: string;
  buttonHoverBackground: string;
  buttonActiveBackground: string;
  borderColorHover: string;
  searchBoxBackgroundColor: string;
  labelColor: string;
  linkColor: string;
  mentionsColor: string;
};

export type MessageBodyBullet = { bullet: MessageBody };
export type MessageBodyOrdered = { ordered: MessageBody };
export type MessageBodyItem = { item: MessageBody };
export type MessageBodyCodeblock = { codeblock: string };
export type MessageBodyBlockquote = { blockquote: MessageBody };
export type MessageBodyCode = { code: string };
export type MessageBodyLine = { line: MessageBody};
export type MessageBodyBr = {br: boolean};
export type MessageBodyText = { text: string };
export type MessageBodyBold = { bold: MessageBody };
export type MessageBodyItalic = { italic: MessageBody };
export type MessageBodyUnderline = { underline: MessageBody };
export type MessageBodyStrike = { strike: MessageBody };
export type MessageBodyImg = {img: { src: string, alt: string }};
export type MessageBodyLink = {link: { href: string, children: MessageBody }};
export type MessageBodyEmoji = {emoji:string};
export type MessageBodyChannel = {channel: string};
export type MessageBodyUser = {user: string};
export type MessageBodyThread = {thread: { channelId: string, parentId: string, text: string }};

export type MessageBodyPart = MessageBodyBullet | MessageBodyOrdered | MessageBodyItem
  | MessageBodyCodeblock | MessageBodyBlockquote | MessageBodyCode
  | MessageBodyLine | MessageBodyBr | MessageBodyText | MessageBodyBold
  | MessageBodyItalic | MessageBodyUnderline | MessageBodyStrike
  | MessageBodyImg | MessageBodyLink | MessageBodyEmoji | MessageBodyChannel
  | MessageBodyUser | MessageBodyThread;

export type MessageBody = MessageBodyPart[] | MessageBodyPart;

export type Message = {
  id?: string;
  clientId: string;
  message: MessageBody;
  flat: string;
  channelId: string;
  parentId: string;
  userId: string;
  emojiOnly: boolean;
  createdAt: string;
  updatedAt: string;
  links: string[];
  pinned: boolean;
  editing: boolean;
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
  attachments: {
    id: string;
    fileName: string;
    contentType: string;
  }[];
  reactions: {
    reaction: string;
    userId: string;
  }[];
  info?: {
    type: string;
    action?: string;
    msg: string;
  };
  thread?: {
    childId: string;
    userId: string;
  }[];
  // TODO: is it correct?
  progress?: {
    userId: string;
    user: {
      avatarUrl: string;
      name: string;
    }
  }[];
  priv?: boolean;
};

export type User = {
  id: string;
  name: string;
  status: string;
  avatar: string;
  avatarUrl: string;
  avatarFileId: string;
  connected: boolean;
  lastSeen: string;
  system: boolean;
};

export type EmptyEmoji= {
  empty: true,
  shortname: string
  category?: string,
}

export type DefinedEmoji = {
  empty?: false,
  unicode?: string,
  fileId?: string,
  shortname: string
  category?: string,
}

export type EmojiDescriptor = EmptyEmoji | DefinedEmoji;

export type Notif = {
  id?: string;
  clientId: string;
  userId: string;
  notifType: string;
  notif: string;
  createdAt: string;
  priv?: boolean;
}

export type Stream = {
  id?: string,
  type: 'live' | 'archive',
  channelId: string,
  parentId?: string,
  selected?: string,
  date?: string,
};

export type Channel = {
  id: string;
  name: string;
  users: string[];
  channelType: string;
  priv?: boolean;
  direct?: boolean;
  private?: boolean;
};

export type Progress = {
  channelId: string;
  userId: string;
  parentId: string;
  count: number;
  lastMessageId: string;
}

export type Notification = {
  id: string;
  userId: string;
  channelId: string;
  parentId: string;
  createdAt: string;
  messageId: string;
}

export type UserConfig = {
  appVersion: string,
  mainChannelId: string,
  vapidPublicKey: string,
}
