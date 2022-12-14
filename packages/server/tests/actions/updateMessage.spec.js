const assert = require('assert');
const { db } = require('../../src/infra/database');

module.exports = (connect) => {
  describe('updateMessage', () => {
    let messageId;
    before(async () => {
      const user = await (await db).collection('users')
        .findOne({ login: 'mateusz' });
      ({ insertedId: messageId } = await (await db).collection('messages')
        .insertOne({ message: { text: 'asd' }, flat: 'asd', userId: user._id.toHexString(), clientId: 'x' + Math.random() }));
    });

    it('should update message', async () => {
      const ws = await connect('mateusz');
      const [msg, ret] = await ws.send({
        type: 'updateMessage',
        id: messageId,
        flat: 'test',
      });
      assert.equal(ret.type, 'response');
      assert.equal(ret.status, 'ok');
      assert.equal(msg.id, messageId);
      assert.equal(msg.type, 'message');
      assert.equal(msg.flat, 'test');
      assert.deepEqual(msg.message, { text: 'asd' });
      ws.close();
    });
  });
};
