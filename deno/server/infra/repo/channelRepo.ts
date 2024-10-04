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

  async join(query: ChannelQuery, userId: EntityId) {
    const { db } = await this.connect();
    return db.collection(this.COLLECTION)
      .updateOne(
        this.makeQuery(query),
        { $push: { users: serialize(userId) } },
      );
  }
}
