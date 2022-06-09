const assert = require('assert');
const {db} = require('../../src/infra/database');

module.exports = connect => {
  describe('/name <name>', () => {
    const NAME = 'Mateusz';

    let ws;
    before(async () => {
      ws = await connect('mateusz');
      await (await db)
        .collection('users')
        .updateOne({login: 'mateusz'}, {$set: {name: 'Johny'}});
    })

    after(async () => {
      ws.close();
    })

    it('should change users name and infor about change', async () => {
      const [user, ret] = await ws.send({
        type: 'command',
        name: 'name', 
        args: [NAME],
      });
      assert.equal(ret.type, 'response');
      assert.equal(ret.status, 'ok');

      const state = await (await db)
        .collection('users')
        .findOne({login: 'mateusz'});
      assert.equal(state.name, NAME);

      assert.equal(user.type, 'user');
      assert.equal(user.name, NAME);
      assert.equal(user.id, ws.userId);
    })

    it('should inform others about change');
  })
}
