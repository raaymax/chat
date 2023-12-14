const assert = require('assert');
const { db } = require('../../src/infra/repositories');

module.exports = (connect) => {
  describe('message:create', () => {
    let channel;
    before(async () => {
      channel = await (await db).collection('channels').findOne({ name: 'main' });
    });
    it('should be received by other users', async () => {
      const member = await connect('member');
      const admin = await connect('admin');
      return new Promise((resolve, reject) => {
        try {
          member.on('type:message', (msg) => {
            assert.equal(msg.type, 'message');
            assert.equal(msg.message?.line?.text, 'Hello');
            assert.equal(msg.userId, admin.userId);
            member.close();
            admin.close();
            resolve();
          });
          admin.send({
            type: 'message:create',
            clientId: `test:${Math.random()}`,
            channelId: channel._id.toHexString(),
            message: { line: { text: 'Hello' } },
            flat: 'Hello',
          });
        } catch (err) {
          reject(err);
        }
      });
    });
  });
};
