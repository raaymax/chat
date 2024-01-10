const assert = require('assert');
const api = require('../../actions/tests/api');

module.exports = (connect) => {
  describe('/help', () => {
    it('should return help message', async () => {
      const ws = await connect();
      const channel = await api.repo.channel.get({ name: 'main' });
      const { res, data: [help] } = await api.sendMessage({
        type: 'command:execute',
        name: 'help',
        args: [],
        context: {
          channelId: channel.id,
        },
      });
      assert.equal(res.type, 'response');
      assert.equal(res.status, 'ok');
      assert.equal(help.type, 'message');
      assert.equal(help.id.slice(0, 3), 'sys');
      assert.equal(help.priv, true);
      ws.close();
    });
  });
};
