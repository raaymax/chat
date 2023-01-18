const assert = require('assert');
const { db } = require('../../src/infra/database');

module.exports = (connect) => {
  describe('/avatar <url>', () => {
    const URL = 'http://example.com/avatar.png';

    let ws;
    before(async () => {
      ws = await connect('mateusz');
      await (await db)
        .collection('users')
        .updateOne({ login: 'mateusz' }, { $set: { avatarUrl: null } });
    });

    after(async () => {
      ws.close();
    });

    it('should change users avatar and infor about change', async () => {
      const channel = await (await db).collection('channels').findOne({ name: 'main' });
      const [user, ret] = await ws.send({
        type: 'command',
        name: 'avatar',
        args: [URL],
        context: {
          channelId: channel._id.toHexString(),
        },
      });
      assert.equal(ret.type, 'response');
      assert.equal(ret.status, 'ok');

      const state = await (await db)
        .collection('users')
        .findOne({ login: 'mateusz' });
      assert.equal(state.avatarUrl, URL);

      assert.equal(user.type, 'user');
      assert.equal(user.avatarUrl, URL);
      assert.equal(user.id, ws.userId);
    });

    it('should inform others about change');
  });
};
