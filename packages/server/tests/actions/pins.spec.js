const assert = require('assert');
const seeds = require('./seeds');

module.exports = (connect) => {
  describe('load', () => {
    before(async () => {
      await seeds.run();
    });
    it('should return last added messsage', async () => {
      const ws = await connect();
      const [msg, ret] = await ws.send({
        type: 'pins',
        channel: 'main',
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
