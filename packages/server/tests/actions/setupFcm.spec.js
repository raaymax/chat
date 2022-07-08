const assert = require('assert');
const crypto = require('crypto');
const { db } = require('../../src/infra/database');

module.exports = (connect) => {
  describe('setupFcm', () => {
    it('should update fcm token for current session', async () => {
      const ws = await connect();
      const token = crypto.randomBytes(5).toString('hex');
      const [ret] = await ws.send({
        type: 'setupFcm',
        token,
      });
      assert.equal(ret.type, 'response');
      assert.equal(ret.status, 'ok');
      const [session] = await (await db).collection('httpSessions')
        .find({ 'session.fcmToken': token }).toArray();
      assert.ok(session);
      ws.close();
    });
    it('should throw error when token is not present', async () => {
      const ws = await connect();
      const [ret] = await ws.send({
        type: 'setupFcm',
      }).catch((e) => e);
      assert.equal(ret.status, 'error');
      assert.equal(ret.message, '"token" is required');
      ws.close();
    });
  });
};
