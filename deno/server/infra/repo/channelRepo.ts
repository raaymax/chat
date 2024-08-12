import { serialize } from "./serializer.ts";
import { Channel, EntityId } from "../../types.ts";
import { Repo } from "./repo.ts";

type ChannelQuery = Partial<Channel & { userId: EntityId }>;
export class ChannelRepo extends Repo<ChannelQuery, Channel> {
  COLLECTION = "channels";

  makeQuery(data: ChannelQuery) {
    const { userId, ...rest } = serialize(data);
    return {
      ...rest,
      ...(userId ? { users: { $elemMatch: { $eq: userId } } } : {}),
    };
  }
}

