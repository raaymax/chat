import { Invitation } from "../../types.ts";
import { Repo } from "./repo.ts";

type InvitationQuery = Partial<Invitation>;
export class InvitationRepo extends Repo<InvitationQuery, Invitation> {
  COLLECTION = "invitations";
}

