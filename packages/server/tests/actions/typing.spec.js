const assert = require('assert');

module.exports = (connect) => {
  describe('typing', () => {
    it('should be received by other users', async () => {
      const melisa = await connect('melisa');
      const mateusz = await connect('mateusz');
      return new Promise((resolve, reject) => {
        try {
          melisa.on('type:typing', (msg) => {
            assert.equal(msg.type, 'typing');
            assert.equal(msg.channel, 'main');
            assert.equal(msg.userId, mateusz.userId);
            resolve();
          });
          mateusz.send({
            type: 'typing',
            channel: 'main',
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
        type: 'typing',
      }).catch((e) => e);
      assert.equal(ret.status, 'error');
      assert.equal(ret.message, 'MISSING_CHANNEL');
      ws.close();
    });

    it('should not send notification to source user', async () => {
      const ws = await connect();
      const [ret] = await ws.send({
        type: 'typing',
        channel: 'main',
      });
      assert.equal(ret.type, 'response');
      assert.equal(ret.status, 'ok');
      ws.close();
    });
  });
};