import Repo from '../repo';
import { Invitation, InvitationQuery, MongoInvitation } from './invitationTypes';
import { InvitationSerializer } from './invitationSerializer';

export class InvitationRepo extends Repo<InvitationQuery, Invitation, MongoInvitation> {
  constructor() {
    super('invitations', new InvitationSerializer());
  }
}
