const assert = require('assert');
const { db } = require('../../src/infra/repositories');

module.exports = (connect) => {
  describe('typing:send', () => {
    let channel;
    before(async () => {
      channel = await (await db).collection('channels').findOne({ name: 'main' });
    });

    it('should be received by other users', async () => {
      const melisa = await connect('melisa');
      const mateusz = await connect('mateusz');
      return new Promise((resolve, reject) => {
        try {
          melisa.on('type:typing', (msg) => {
            assert.equal(msg.type, 'typing');
            assert.equal(msg.channelId, channel._id.toHexString());
            assert.equal(msg.userId, mateusz.userId);
            resolve();
          });
          mateusz.send({
            type: 'typing:send',
            channelId: channel._id.toHexString(),
          });
        } catch (err) {
          reject(err);
        }
      }).catch((e) => {
        melisa.close();
        mateusz.close();
        throw e;
      }).then(() => {
        melisa.close();
        mateusz.close();
      });
    });

    it('should throw error when channel is not present', async () => {
      const ws = await connect();
      const [ret] = await ws.send({
        type: 'typing:send',
      }).catch((e) => e);
      assert.equal(ret.status, 'error');
      assert.equal(ret.message, '"channelId" is required');
      ws.close();
    });

    it('should not send notification to source user', async () => {
      const ws = await connect();
      const [ret] = await ws.send({
        type: 'typing:send',
        channelId: channel._id.toHexString(),
      });
      assert.equal(ret.type, 'response');
      assert.equal(ret.status, 'ok');
      ws.close();
    });
  });
};
