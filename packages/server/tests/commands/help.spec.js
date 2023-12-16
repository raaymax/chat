const assert = require('assert');
const repo = require('../../src/infra/repositories');

module.exports = (connect) => {
  describe('/help', () => {
    it('should return help message', async () => {
      const ws = await connect();
      const channel = await repo.channel.get({ name: 'main' });
      const [help, ret] = await ws.send({
        type: 'command:execute',
        name: 'help',
        args: [],
        context: {
          channelId: channel.id,
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
