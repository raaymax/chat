const assert = require('assert');
const seeds = require('./seeds');
const { db } = require('../../src/infra/database');

module.exports = (connect) => {
  describe('pins', () => {
    let channel;
    before(async () => {
      await seeds.run();
      channel = await (await db).collection('channels').findOne({ name: 'main' });
    });
    it('should return last added messsage', async () => {
      const ws = await connect();
      const [msg, ret] = await ws.send({
        type: 'pins',
        channelId: channel._id.toHexString(),
        limit: 1,
      });
      assert.equal(ret.type, 'response');
      assert.equal(ret.status, 'ok');
      assert.equal(ret.count, 1);
      assert.equal(msg.flat, 'Hello pinned');
      ws.close();
    });
    it('should return pins with before filter');
    it('should return pins with after filter');
  });
};
