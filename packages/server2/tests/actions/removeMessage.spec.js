const assert = require('assert');
const { db } = require('../../src/infra/database');

module.exports = (connect) => {
  describe('removeMessage', () => {
    it('should remove message', async () => {
      const ws = await connect();
      const toBeRemoved = await createMessage(ws);
      const [msg, ret] = await ws.send({
        type: 'removeMessage',
        id: toBeRemoved.id,
      });
      assert.equal(ret.type, 'response');
      assert.equal(ret.status, 'ok');
      assert.equal(msg.id, toBeRemoved.id);
      assert.equal(msg.type, 'message');
      assert.equal(msg.notif, 'Message removed');
      assert.deepEqual(msg.message, []);
      ws.close();
    });

    it('should prevent deletion of not owned messages', async () => {
      const ws = await connect('mateusz');
      const melisa = await connect('melisa');
      const toBeRemoved = await createMessage(melisa);
      const [ret] = await ws.send({
        type: 'removeMessage',
        id: toBeRemoved.id,
      }).catch((e) => e);
      assert.equal(ret.type, 'response');
      assert.equal(ret.status, 'error');
      assert.equal(ret.message, 'NOT_OWNER_OF_MESSAGE');
      ws.close();
      melisa.close();
    });

    async function createMessage(ws) {
      const [msg, ret] = await ws.send({
        type: 'message',
        channel: 'main',
        message: { line: { text: 'Hello' } },
        flat: 'Hello',
      });
      assert.equal(ret.type, 'response');
      assert.equal(ret.status, 'ok');
      assert.equal(msg.userId, ws.userId);
      return msg;
    }
  });
};
