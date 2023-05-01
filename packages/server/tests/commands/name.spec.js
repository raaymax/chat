const assert = require('assert');
const { db } = require('../../src/infra/repositories');

module.exports = (connect) => {
  describe('/name <name>', () => {
    const NAME = 'Admin';

    let ws;
    before(async () => {
      ws = await connect('admin');
      await (await db)
        .collection('users')
        .updateOne({ login: 'admin' }, { $set: { name: 'Johny' } });
    });

    after(async () => {
      await (await db).collection('users').updateOne({ login: 'admin' }, { $set: { name: 'Admin' } });
      ws.close();
    });

    it('should change users name and infor about change', async () => {
      const channel = await (await db).collection('channels').findOne({ name: 'main' });
      const [user, ret] = await ws.send({
        type: 'command:execute',
        name: 'name',
        args: [NAME],
        context: {
          channelId: channel._id.toHexString(),
        },
      });
      assert.equal(ret.type, 'response');
      assert.equal(ret.status, 'ok');

      const state = await (await db)
        .collection('users')
        .findOne({ login: 'admin' });
      assert.equal(state.name, NAME);

      assert.equal(user.type, 'user');
      assert.equal(user.name, NAME);
      assert.equal(user.id, ws.userId);
    });

    it('should inform others about change');
  });
};
