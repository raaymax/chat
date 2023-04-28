import { connect, init } from './db';
import { MessageRepo } from './message/messageRepo';
import { ChannelRepo } from './channel/channelRepo';
import { UserRepo } from './user/userRepo';
import { EmojiRepo } from './emoji/emojiRepo';
import { BadgeRepo } from './badge/badgeRepo';
import { SessionRepo } from './session/sessionRepo';
import { ObjectId } from 'mongodb';

export * from './message/messageTypes';
export * from './channel/channelTypes';

export const createRepositories = (databaseUrl) => {
  const client = init(databaseUrl);
  return {
    db: connect().then(({db}) => db),
    ObjectId,
    message: new MessageRepo(),
    channel: new ChannelRepo(),
    user: new UserRepo(),
    emoji: new EmojiRepo(),
    badge: new BadgeRepo(),
    session: new SessionRepo(),
    close: () => client.close(),
  }
}


