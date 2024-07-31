import { Invitation } from "../../types.ts";
import { Repo } from "./repo.ts";

type InvitationQuery = Partial<Invitation>;
class InvitationRepo extends Repo<InvitationQuery, Invitation> {
  COLLECTION = "invitations";
}

export const invitation = new InvitationRepo();
