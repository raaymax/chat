import { Repository } from "../../infra/mod.ts";
import { EntityId, User } from "../../types.ts";
import { InvalidUser } from "../errors.ts";

export const usersExists = async (repo: Repository, userIds: EntityId[]) => {
  const users = await Promise.all(userIds.map((id) => repo.user.get({ id })));
  const errorIds: EntityId[] = [];
  users.map((u: User | null, idx: number) => {
    if (!u) {
      errorIds.push(userIds[idx]);
    }
  });
  if (errorIds.length > 0) {
    throw new InvalidUser("User not exist", errorIds.map((e) => e.toString()));
  }
  return true;
};
