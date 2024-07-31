import { serialize } from "./serializer.ts";
import { EntityId, User } from "../../types.ts";
import { Repo } from "./repo.ts";

type UserQuery = Partial<User & { userId: EntityId }>;
class UserRepo extends Repo<UserQuery, User> {
  COLLECTION = "users";

  makeQuery(data: UserQuery) {
    const { userId, ...rest } = serialize(data);
    return {
      ...rest,
      ...(userId ? { users: { $elemMatch: { $eq: userId } } } : {}),
    };
  }
}

export const user = new UserRepo();
