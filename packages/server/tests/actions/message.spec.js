const assert = require('assert');
const { db } = require('../../src/infra/repositories');

module.exports = (connect) => {
  describe('message:send', () => {
    let channel;
    before(async () => {
      channel = await (await db).collection('channels').findOne({ name: 'main' });
    });
    it('should be received by other users', async () => {
      const member = await connect('member');
      const admin = await connect('admin');
      return new Promise((resolve, reject) => {
        try {
          member.on('type:message', (msg) => {
            assert.equal(msg.type, 'message');
            assert.equal(msg.message?.line?.text, 'Hello');
            assert.equal(msg.userId, admin.userId);
            member.close();
            admin.close();
            resolve();
          });
          admin.send({
            type: 'message:send',
            clientId: `test:${Math.random()}`,
            channelId: channel._id.toHexString(),
            message: { line: { text: 'Hello' } },
            flat: 'Hello',
          });
        } catch (err) {
          reject(err);
        }
      });
    });

    it('should be received by sender', async () => {
      const ws = await connect();
      const [msg, ret] = await ws.send({
        type: 'message:send',
        clientId: `test:${Math.random()}`,
        channelId: channel._id.toHexString(),
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
      await ws.send({
        type: 'message:send',
        clientId,
        channelId: channel._id.toHexString(),
        message: { line: { text: 'Hello' } },
        flat: 'Hello',
      });
      const msg = await (await db).collection('messages').findOne({ clientId });
      assert.equal(msg.message?.line?.text, 'Hello');
      assert.equal(msg.flat, 'Hello');
      assert.ok(Object.keys(msg).includes('createdAt'));
      assert.equal(msg.clientId, clientId);
      ws.close();
    });

    it('should accept attachments', async () => {
      const ws = await connect();
      const [msg, ret] = await ws.send({
        type: 'message:send',
        clientId: `test:${Math.random()}`,
        message: { line: { text: 'Hello' } },
        channelId: channel._id.toHexString(),
        flat: 'Hello',
        attachments: [
          {
            id: 'random',
            fileName: 'test.txt',
            contentType: 'text/plain',
            sonething: 'else',
          },
        ],
      });
      assert.equal(msg.type, 'message');
      assert.equal(msg.attachments.length, 1);
      assert.deepEqual(Object.keys(msg.attachments[0]), ['id', 'fileName', 'contentType']);
      assert.equal(ret.type, 'response');
      assert.equal(ret.status, 'ok');
      ws.close();
    });

    it('should not broadcast when sending to private channels');

    it('should validate attachments?');

    it('should accept attachments without message');

    it('should return error when channelId is missing', async () => {
      const ws = await connect();
      const [ret] = await ws.send({
        type: 'message:send',
        clientId: `test:${Math.random()}`,
        message: { line: { text: 'Hello' } },
        flat: 'Hello',
      }).catch((e) => e);
      assert.equal(ret.status, 'error');
      assert.equal(ret.message, '"channelId" is required');
      ws.close();
    });

    it('should return error when message is missing', async () => {
      const ws = await connect();
      const [ret] = await ws.send({
        type: 'message:send',
        clientId: `test:${Math.random()}`,
        channelId: channel._id.toHexString(),
        flat: 'Hello',
      }).catch((e) => e);
      assert.equal(ret.status, 'error');
      assert.equal(ret.message, '"message" is required');
      ws.close();
    });

    it('should control access to private channels', async () => {
      const ws = await connect();
      const otherChannel = await (await db)
        .collection('channels')
        .findOne({ name: 'Member' });
      const [ret] = await ws.send({
        type: 'message:send',
        clientId: `test:${Math.random()}`,
        channelId: otherChannel._id.toHexString(),
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
        type: 'message:send',
        clientId: `test:${Math.random()}`,
        channelId: channel._id.toHexString(),
        message: { text: 'Hello' },
      }).catch((e) => e);
      assert.equal(ret.type, 'response');
      assert.equal(ret.status, 'error');
      assert.equal(ret.message, '"flat" is required');
      ws.close();
    });
  });
};
