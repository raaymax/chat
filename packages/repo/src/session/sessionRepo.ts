import Repo from '../repo';
import { Session, SessionQuery, MongoSession } from './sessionTypes';
import { SessionSerializer } from './sessionSerializer';
import { connect } from '../db';

export class SessionRepo extends Repo<SessionQuery, Session, MongoSession> {
  constructor() {
    super('sessions', new SessionSerializer());
  }

  async getByToken(token: string) {
    const { db } = await connect();
    return db.collection(this.tableName)
      .findOne({ 'session.token': token })
      .then(this.serializer.deserializeModel);
  }
}
