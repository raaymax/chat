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
  notifications: {
    [key: string]: {
      mobile: string
      refreshedAt: Date
    }
  }
};

export type UserQuery = User & {
  ids: Id[]
};
export type MongoUser = ReplaceType<ReplaceId<User>, Id, ObjectId>;
