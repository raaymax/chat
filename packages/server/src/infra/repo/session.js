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
}

module.exports = { SessionRepo };
