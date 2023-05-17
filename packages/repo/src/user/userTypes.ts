import { ObjectId } from "mongodb";
import { Id, ReplaceId, ReplaceType } from "../types";

export type User = {
  id: Id,
  name: string
  avatarUrl: string
  login: string
  password: string
  clientId: string
  mainChannelId: Id | null
  avatarFileId: string
  notifications: {
    [key: string]: {
      mobile: string
      refreshedAt: Date
    }
  }
  webPush: {
    [key: string]: {
      endpoint: string
      expirationTime: number | null
      keys: {
        p256dh: string
        auth: string
      }
    }
  }
};

export type UserQuery = User & {
  ids: Id[]
};
export type MongoUser = ReplaceType<ReplaceId<User>, Id, ObjectId>;
