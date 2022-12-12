const assert = require('assert');

module.exports = (connect) => {
  describe('search', () => {
    it('should search for messages', async () => {
      const ws = await connect();
      const newMsg = await createMessage(ws);
      const [msg, ret] = await ws.send({
        type: 'search',
        channel: 'main',
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
      const [msg, ret] = await ws.send({
        clientId: `${Math.random()}`,
        type: 'message',
        channel: 'main',
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
