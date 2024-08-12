import { serialize } from "./serializer.ts";
import { EntityId, User } from "../../types.ts";
import { Repo } from "./repo.ts";

type DbUser = User & { mainChannelId: EntityId };

type UserQuery = Partial<DbUser & { userId: EntityId }>;
export class UserRepo extends Repo<UserQuery, DbUser> {
  COLLECTION = "users";

  makeQuery(data: UserQuery) {
    const { userId, ...rest } = serialize(data);
    return {
      ...rest,
      ...(userId ? { users: { $elemMatch: { $eq: userId } } } : {}),
    };
  }
}

