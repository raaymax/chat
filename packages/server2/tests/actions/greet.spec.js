const assert = require('assert');
const {db} = require('../../src/infra/database');
const crypto = require('crypto');

module.exports = (connect) => {
  describe('greet', () => {
    it('should return welcome message', async () => {
      const ws = await connect();
      const [msg, ret] = await ws.send({
        type: 'greet',
      })
      assert.equal(ret.type, 'response');
      assert.equal(ret.status, 'ok');
      assert.equal(msg.type, 'message');
      assert.equal(msg.userId, 'system');
      assert.equal(msg.priv, true);
      assert.ok(Object.keys(msg).includes('createdAt'))
      ws.close();
    })
  })
}
