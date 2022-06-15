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
      assert.equal(channels[0].type, 'channel');
      assert.equal(channels[0].name, 'main');
      assert.equal(channels[0].cid, 'main');
      assert.equal(channels[1].type, 'channel');
      assert.equal(channels[1].name, 'Mateusz');
      assert.equal(channels[1].cid, ws.userId);
      ws.close();
    });
  });
};
