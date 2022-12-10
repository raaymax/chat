const assert = require('assert');
const crypto = require('crypto');
const { db, ObjectId } = require('../../src/infra/database');

module.exports = (connect) => {
  describe('setupFcm', () => {
    it('should update fcm token for current session', async () => {
      const ws = await connect();
      const token = 'testToken';
      const [ret] = await ws.send({
        type: 'setupFcm',
        token,
      });
      assert.equal(ret.type, 'response');
      assert.equal(ret.status, 'ok');
      const user = await (await db).collection('users')
        .findOne({ _id: ObjectId(ws.userId) });
      assert.ok(user.notifications[token]);
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
