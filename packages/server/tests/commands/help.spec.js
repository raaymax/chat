const assert = require('assert');

module.exports = (connect) => {
  describe('/help', () => {
    it('should return help message', async () => {
      const ws = await connect();
      const [help, ret] = await ws.send({
        type: 'command',
        name: 'help',
        args: [],
        context: {
          channel: 'main',
        },
      });
      assert.equal(ret.type, 'response');
      assert.equal(ret.status, 'ok');
      assert.equal(help.type, 'message');
      assert.equal(help.id, 'help');
      assert.equal(help.priv, true);
      ws.close();
    });
  });
};
