const assert = require('assert');
const api = require('../../tests/api');
const seeds = require('../../../../../tests/actions/seeds');

module.exports = (connect) => {
  describe('messages:pins', () => {
    let channel;
    before(async () => {
      await seeds.run();
      channel = await api.repo.channel.get({ name: 'main' });
    });
    it('should return last added messsage', async () => {
      const ws = await connect();
      const [msg, ret] = await ws.send({
        type: 'messages:pins',
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
