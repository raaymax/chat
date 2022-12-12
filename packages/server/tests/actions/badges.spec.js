const assert = require('assert');
const { db } = require('../../src/infra/database');

module.exports = (connect) => {
  describe('badges', () => {
    let channel;
    before(async () => {
      channel = await (await db).collection('channels').findOne({ name: 'main' });
    });
    const sendHello = (ws) => ws.send({
      type: 'message',
      clientId: `test:${Math.random()}`,
      channelId: channel._id.toHexString(),
      message: { line: { text: 'Hello' } },
      flat: 'Hello',
    });

    it('should increment count when sending the message', async () => {
      const melisa = await connect('melisa');
      const user = await (await db).collection('users').findOne({ name: 'Mateusz' });
      await (await db).collection('badges').deleteMany({ userId: user._id, channelId: channel._id });
      await (await db).collection('badges').insertOne({ userId: user._id, channelId: channel._id, count: 0 });
      await sendHello(melisa);
      const badge = await (await db).collection('badges').findOne({ userId: user._id, channelId: channel._id });
      assert.equal(badge.count, 1);
      melisa.close();
    });

    it('should update counter to remaining messages', async () => {
      const mateusz = await connect('mateusz');
      const melisa = await connect('melisa');
      const user = await (await db).collection('users').findOne({ name: 'Mateusz' });
      await (await db).collection('badges').deleteMany({ userId: user._id, channelId: channel._id });
      await (await db).collection('badges').insertOne({ userId: user._id, channelId: channel._id, count: 0 });
      const [msg] = await sendHello(melisa);
      await sendHello(melisa);
      await mateusz.send({
        type: 'updateProgress',
        messageId: msg.id,
      });
      const badge = await (await db).collection('badges').findOne({ userId: user._id, channelId: channel._id });
      assert.equal(badge.count, 1);
      mateusz.close();
      melisa.close();
    });

    it('should reset counter when sending message', async () => {
      const mateusz = await connect('mateusz');
      const melisa = await connect('melisa');
      const user = await (await db).collection('users').findOne({ name: 'Mateusz' });
      await (await db).collection('badges').deleteMany({ userId: user._id, channelId: channel._id });
      await (await db).collection('badges').insertOne({ userId: user._id, channelId: channel._id, count: 0 });
      await sendHello(melisa);
      await sendHello(melisa);
      await sendHello(mateusz);
      const badge = await (await db).collection('badges').findOne({ userId: user._id, channelId: channel._id });
      assert.equal(badge.count, 0);
      mateusz.close();
      melisa.close();
    });
  });
};
