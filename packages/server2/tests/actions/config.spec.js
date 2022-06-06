const assert = require('assert');
const pack = require('../../package.json');

module.exports = (connect) => {
  describe('config', () => {
    it('should return app configuration', async () => {
      const ws = await connect();
      const [config, ret] = await ws.send({
        type: 'config',
      })
      assert.equal(ret.type, 'response');
      assert.equal(ret.status, 'ok');
      assert.equal(config.appVersion, pack.version);
      ws.close();
    })
  })
}
