const assert = require('assert');
const { db } = require('../../src/infra/database');

module.exports = (connect) => {
  describe('message', () => {
    it('should be received by other users', async () => new Promise(async (resolve, reject) => {
      const melisa = await connect('melisa');
      const mateusz = await connect('mateusz');
      melisa.on('type:message', (msg) => {
        assert.equal(msg.type, 'message');
        assert.equal(msg.message?.line?.text, 'Hello');
        assert.equal(msg.userId, mateusz.userId);
        melisa.close();
        mateusz.close();
        resolve();
      });
      mateusz.send({
        type: 'message',
        channel: 'main',
        message: { line: { text: 'Hello' } },
        flat: 'Hello',
      });
    }));

    it('should be received by sender', async () => {
      const ws = await connect();
      const [msg, ret] = await ws.send({
        type: 'message',
        channel: 'main',
        message: { line: { text: 'Hello' } },
        flat: 'Hello',
      });
      assert.equal(msg.type, 'message');
      assert.ok(Object.keys(msg).includes('createdAt'));
      assert.equal(msg.message?.line?.text, 'Hello');
      assert.equal(ret.type, 'response');
      assert.equal(ret.status, 'ok');
      ws.close();
    });

    it('should store message in database', async () => {
      const ws = await connect();
      const clientId = `${Math.random() + 1}`;
      const [created, ret] = await ws.send({
        type: 'message',
        channel: 'main',
        clientId,
        message: { line: { text: 'Hello' } },
        flat: 'Hello',
      });
      const msg = await (await db).collection('messages').findOne({ clientId });
      assert.equal(msg.message?.line?.text, 'Hello');
      assert.ok(Object.keys(msg).includes('createdAt'));
      assert.equal(msg.clientId, clientId);
      ws.close();
    });

    it('should return error when channel is missing', async () => {
      const ws = await connect();
      const [ret] = await ws.send({
        type: 'message',
        message: { line: { text: 'Hello' } },
        flat: 'Hello',
      }).catch((e) => e);
      assert.equal(ret.status, 'error');
      assert.equal(ret.message, 'MISSING_CHANNEL');
      ws.close();
    });

    it('should return error when message is missing', async () => {
      const ws = await connect();
      const [ret] = await ws.send({
        type: 'message',
        channel: 'main',
        flat: 'Hello',
      }).catch((e) => e);
      assert.equal(ret.status, 'error');
      assert.equal(ret.message, 'MISSING_MESSAGE');
      ws.close();
    });

    it('should control access to private channels', async () => {
      const ws = await connect();
      const channel = await (await db)
        .collection('channels')
        .findOne({ name: 'Melisa' });
      const [ret] = await ws.send({
        type: 'message',
        channel: channel.cid,
        message: { text: 'Hello' },
        flat: 'Hello',
      }).catch((e) => e);
      assert.equal(ret.type, 'response');
      assert.equal(ret.status, 'error');
      assert.equal(ret.message, 'ACCESS_DENIED');
      ws.close();
    });

    it('should return error when flat is missing', async () => {
      const ws = await connect();
      const [ret] = await ws.send({
        type: 'message',
        channel: 'main',
        message: { text: 'Hello' },
      }).catch((e) => e);
      assert.equal(ret.type, 'response');
      assert.equal(ret.status, 'error');
      assert.equal(ret.message, 'MISSING_FLAT');
      ws.close();
    });
  });
};
