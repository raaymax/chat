import { Database } from "./db.ts";
import { deserialize, serialize } from "./serializer.ts";
import { EntityId, Session } from "../../types.ts";

export class SessionRepo {
  constructor(private db: Database) {}

  get connect() {
    return this.db.connect;
  }

  #generateToken() {
    return Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
  }

  async create(data: { userId: EntityId }): Promise<EntityId> {
    const { db } = await this.connect();
    const newSession = serialize({
      userId: data.userId,
      token: this.#generateToken(),
    });
    const ret = await db.collection("sessions").insertOne(newSession);
    return deserialize(ret.insertedId);
  }

  async remove(data: { id?: EntityId }): Promise<void> {
    const { db } = await this.connect();
    const { id } = data;
    if (!id) return;
    await db.collection("sessions").deleteOne(serialize(data));
  }

  async get(data: Partial<Session>): Promise<Session | null> {
    if (!data) return null;
    const { db } = await this.connect();
    const session = await db.collection("sessions").findOne(serialize(data));
    return deserialize(session);
  }
}
