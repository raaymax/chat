const assert = require('assert');
const api = require('../../tests/api');

module.exports = (connect) => {
  describe('search', () => {
    let channel;
    before(async () => {
      channel = await api.repo.channel.get({ name: 'main' });
    });
    after(async () => {
      await api.repo.close();
    });
    it('should search for messages', async () => {
      const ws = await connect();
      const newMsg = await createMessage(ws);
      const [msg, ret] = await api.sendMessage({
        type: 'message:search',
        channelId: channel._id.toHexString(),
        text: 'Search',
        limit: 1,
      });
      assert.equal(ret.type, 'response');
      assert.equal(ret.status, 'ok');
      assert.equal(ret.count, 1);
      assert.equal(msg.id, newMsg.id);
      assert.equal(msg.type, 'search');
      assert.equal(msg.flat, 'nice Search test');
      ws.close();
    });
    async function createMessage(ws) {
      const [msg, ret] = await api.sendMessage({
        clientId: `${Math.random()}`,
        type: 'message:create',
        channelId: channel._id.toHexString(),
        message: { line: { text: 'Search' } },
        flat: 'nice Search test',
      });
      assert.equal(ret.type, 'response');
      assert.equal(ret.status, 'ok');
      assert.equal(msg.userId, ws.userId);
      return msg;
    }
  });
};
