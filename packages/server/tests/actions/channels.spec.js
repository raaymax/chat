const assert = require('assert');

module.exports = (connect) => {
  describe('channels', () => {
    it('should return list of channels', async () => {
      const ws = await connect('mateusz');
      const channels = await ws.send({
        type: 'channels',
      });
      const ret = channels.pop();
      assert.equal(ret.type, 'response');
      assert.equal(ret.status, 'ok');
      const main = channels.find((c) => c.name === 'main');
      assert.ok(main);
      assert.equal(main.type, 'channel');
      assert.equal(main.name, 'main');
      assert.equal(main.cid, 'main');
      const mateusz = channels.find((c) => c.name === 'Mateusz');
      assert.ok(mateusz);
      assert.equal(mateusz.type, 'channel');
      assert.equal(mateusz.name, 'Mateusz');
      assert.equal(mateusz.cid, ws.userId);
      ws.close();
    });
  });
};
