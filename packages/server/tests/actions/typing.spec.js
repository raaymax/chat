const assert = require('assert');
const repo = require('../../src/infra/repositories');

module.exports = (connect) => {
  describe('user:typing', () => {
    let channel;
    before(async () => {
      channel = await repo.channel.get({ name: 'main' });
    });

    after(async () => {
      await repo.close();
    });

    it('should be received by other users', async () => {
      const member = await connect('member');
      const admin = await connect('admin');
      return new Promise((resolve, reject) => {
        try {
          member.on('type:typing', (msg) => {
            assert.equal(msg.type, 'typing');
            assert.equal(msg.channelId, channel.id);
            assert.equal(msg.userId, admin.userId);
            resolve();
          });
          admin.send({
            type: 'user:typing',
            channelId: channel.id,
          });
        } catch (err) {
          reject(err);
        }
      }).catch((e) => {
        member.close();
        admin.close();
        throw e;
      }).then(() => {
        member.close();
        admin.close();
      });
    });

    it('should throw error when channel is not present', async () => {
      const ws = await connect();
      const [ret] = await ws.send({
        type: 'user:typing',
      }).catch((e) => e);
      assert.equal(ret.status, 'error');
      assert.equal(ret.message, '"channelId" is required');
      ws.close();
    });

    it('should not send notification to source user', async () => {
      const ws = await connect();
      const [ret] = await ws.send({
        type: 'user:typing',
        channelId: channel.id,
      });
      assert.equal(ret.type, 'response');
      assert.equal(ret.status, 'ok');
      ws.close();
    });
  });
};
