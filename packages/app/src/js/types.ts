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
export type MessageBodyBr = {br: {}};
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
  id: string;
  message: MessageBody;
  emojiOnly: boolean;
  createdAt: number;
  pinned: boolean;
  editing: boolean;
  linkPreviews: any;
  attachments: any;
  progress: any;
};
// {"data":{"type":"message","id":"65ff51747475b7d830d03fbf","flat":"awd","message":[{"text":"awd"}],"channelId":"65ff019a77c79e93214b0214","userId":"6255a4156c28443c92c26d7e","channel":"6255a4156c28443c92c26d7e","clientId":"temp:1.aeafiq2dcm:3","emojiOnly":false,"links":[],"mentions":[],"attachments":[],"createdAt":"2024-03-23T22:02:28.567Z","seqId":"jhblkqfc9nh:3","_target":"direct"}}
