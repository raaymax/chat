const assert = require('assert');
const { db, ObjectId } = require('../../src/infra/database');

module.exports = (connect) => {
  const CHANNEL = 'leave-channel';

  describe('/leave', () => {
    let ws;
    let channelId;
    before(async () => {
      ws = await connect('mateusz');
      await (await db).collection('channels').deleteOne({ cid: CHANNEL });
      ({ insertedId: channelId } = await (await db)
        .collection('channels')
        .insertOne({
          cid: CHANNEL,
          name: CHANNEL,
          users: [ObjectId(ws.userId)],
        }));
    });

    after(async () => {
      ws.close();
    });

    it('should remove user from a channel', async () => {
      const [removeChannel, info, ret] = await ws.send({
        type: 'command',
        name: 'leave',
        args: [],
        context: {
          channelId: channelId.toHexString(),
        },
      });
      assert.equal(ret.type, 'response');
      assert.equal(ret.status, 'ok');

      assert.equal(info.type, 'message');
      assert.equal(info.priv, true);
      assert.equal(info.userId, 'system');
      assert.ok(info.createdAt);
      assert.ok(info.message);

      assert.equal(removeChannel.type, 'removeChannel');
      assert.equal(removeChannel.cid, CHANNEL);

      const channel = await (await db)
        .collection('channels')
        .findOne({ cid: CHANNEL });
      assert(!channel.users.map((u) => u.toHexString()).includes(ws.userId));
    });
  });
};
