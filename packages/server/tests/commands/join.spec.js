const assert = require('assert');
const { db } = require('../../src/infra/database');

module.exports = (connect) => {
  const CHANNEL = 'join-channel';

  describe('/join', () => {
    before(async () => {
      await (await db)
        .collection('channels')
        .deleteOne({ cid: CHANNEL });
    });
    afterEach(async () => {
      await (await db)
        .collection('channels')
        .updateOne({ cid: CHANNEL }, { $set: { users: [] } });
    });

    it('should add user to a channel', async () => {
      const ws = await connect('mateusz');
      const [chan, ret] = await ws.send({
        type: 'command',
        name: 'join',
        args: [],
        context: {
          channel: CHANNEL,
        },
      });
      assert.equal(ret.type, 'response');
      assert.equal(ret.status, 'ok');

      assert.equal(chan.type, 'channel');
      assert.equal(chan.cid, CHANNEL);
      assert.equal(chan.name, CHANNEL);
      assert(chan.users.includes(ws.userId));

      const channel = await (await db)
        .collection('channels')
        .findOne({ cid: CHANNEL });
      assert(channel.users.map((u) => u.toHexString()).includes(ws.userId));
      ws.close();
    });

    it('should add user to a existing channel', async () => {
      const ws = await connect('mateusz');
      const [, ret] = await ws.send({
        type: 'command',
        name: 'join',
        args: [],
        context: {
          channel: CHANNEL,
        },
      });
      assert.equal(ret.type, 'response');
      assert.equal(ret.status, 'ok');
      const channel = await (await db)
        .collection('channels')
        .findOne({ cid: CHANNEL });
      assert(channel.users.map((u) => u.toHexString()).includes(ws.userId));
      ws.close();
    });

    it('should not permit adding to private channel', async () => {
      await (await db)
        .collection('channels')
        .updateOne({ cid: CHANNEL }, { $set: { private: true } });

      const ws = await connect('mateusz');
      const [ret] = await ws.send({
        type: 'command',
        name: 'join',
        args: [],
        context: {
          channel: CHANNEL,
        },
      }).catch((e) => e);
      assert.equal(ret.type, 'response');
      assert.equal(ret.status, 'error');
      assert.equal(ret.message, 'ACCESS_DENIED');
      ws.close();
    });
  });
};
