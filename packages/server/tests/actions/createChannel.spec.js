const assert = require('assert');
const { db } = require('../../src/infra/database');

module.exports = (connect) => {
  describe('createChannel', () => {
    it('should prevent creation of channels with the same name', async () => {
      const ws = await connect();
      const [,ret] = await ws.send({
        type: 'createChannel',
        name: 'main',
      }).catch((e) => e);
      assert.equal(ret.type, 'response');
      assert.equal(ret.status, 'ok');
      ws.close();
    });

    it('should create channel', async () => {
      await (await db).collection('channels').deleteMany({ name: 'creation' });
      const ws = await connect();
      const [channel, ret] = await ws.send({
        type: 'createChannel',
        name: 'creation',
      });
      assert.equal(ret.type, 'response');
      assert.equal(ret.status, 'ok');
      assert.equal(channel.name, 'creation');
      assert.equal(channel.private, false);
      ws.close();
    });
  });
};
