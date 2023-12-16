import { ObjectId } from 'mongodb';
import { connect, init, disconnect } from './db';
import { MessageRepo } from './message/messageRepo';
import { ChannelRepo } from './channel/channelRepo';
import { UserRepo } from './user/userRepo';
import { EmojiRepo } from './emoji/emojiRepo';
import { BadgeRepo } from './badge/badgeRepo';
import { SessionRepo } from './session/sessionRepo';
import { InvitationRepo } from './invitation/invitationRepo';

import Repo from './repo';

export { Repo };

export * from './util';
export * from './types';
export * from './message/messageTypes';
export * from './channel/channelTypes';

export const createRepositories = (databaseUrl) => {
  const client = init(databaseUrl);
  return {
    connect,
    ObjectId,
    message: new MessageRepo(),
    channel: new ChannelRepo(),
    user: new UserRepo(),
    emoji: new EmojiRepo(),
    badge: new BadgeRepo(),
    session: new SessionRepo(),
    invitation: new InvitationRepo(),
    close: () => disconnect(),
  };
};
