const assert = require('assert');

module.exports = (connect) => {
  describe('users', () => {
    it('should return list of users', async () => {
      const ws = await connect();
      const users = await ws.send({
        type: 'users',
      });
      const ret = users.pop();
      assert(users.length > 0);
      assert.deepEqual(
        Object.keys(users[0]).sort(),
        ['type', 'id', 'name', 'avatarUrl', 'seqId', 'target'].sort(),
      );
      assert.equal(ret.type, 'response');
      assert.equal(ret.status, 'ok');
      ws.close();
    });

    it('using strings as userId is not the best idea');

    it('should get system user', async () => {
      const ws = await connect();
      const users = await ws.send({
        type: 'users',
      });
      const systemUser = users.find((u) => u.id === 'system');
      assert.equal(systemUser.name, 'System');
      const aiUser = users.find((u) => u.id === 'openai');
      assert.equal(aiUser.name, 'OpenAI');
      ws.close();
    });

    it('should gen only list of users for specific channel?');
  });
};
