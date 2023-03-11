const assert = require('assert');
const { db } = require('../../src/infra/database');

module.exports = (connect) => {
  describe('/help', () => {
    it('should return help message', async () => {
      const ws = await connect();
      const channel = await (await db).collection('channels').findOne({ name: 'main' });
      const [help, ret] = await ws.send({
        type: 'command',
        name: 'help',
        args: [],
        context: {
          channelId: channel._id.toHexString(),
        },
      });
      assert.equal(ret.type, 'response');
      assert.equal(ret.status, 'ok');
      assert.equal(help.type, 'message');
      assert.equal(help.id.slice(0, 3), 'sys');
      assert.equal(help.priv, true);
      ws.close();
    });
  });
};
