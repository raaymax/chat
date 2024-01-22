const { connect } = require('./db');

class SessionRepo {
  constructor() {
    this.tableName = 'httpSessions';
  }

  async getByToken(token) {
    const { db } = await connect();
    return db.collection(this.tableName)
      .findOne({ 'session.token': token });
  }

  async update(id, data) {
    const { db } = await connect();
    return db.collection(this.tableName)
      .update(id, { $set: data });
  }
}

module.exports = { SessionRepo };
