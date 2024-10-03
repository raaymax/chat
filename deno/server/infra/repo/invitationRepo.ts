import { Invitation } from "../../types.ts";
import { Repo } from "./repo.ts";
import { serialize } from "./serializer.ts";

type InvitationQuery = Partial<Invitation>;
export class InvitationRepo extends Repo<InvitationQuery, Invitation> {
  COLLECTION = "invitations";

  async removeOutdated() {
    const { db } = await this.connect();
    return db.collection(this.COLLECTION)
      .deleteMany({expireAt:{ '$lt': new Date()}});
  }

  makeQuery(data: InvitationQuery) {
    const query = serialize(data);
    return {
      ...query,
      expireAt: { '$gt': new Date() },
    };
  }
}
