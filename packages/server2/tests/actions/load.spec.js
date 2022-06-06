const assert = require('assert');
const {db} = require('../../src/infra/database');

module.exports = (connect) => {
  describe('load', () => {
    it('should return last added messsage', async () => {
      const ws = await connect();
      const clientId = '' + (Math.random()+1);
      await ws.send({
        type: 'message',
        clientId,
        channel: 'main',
        message: {line: {text: 'Hello'}},
      })
      const [msg, ret] = await ws.send({
        type: 'load',
        channel: 'main', 
        limit: 1,
      })
      assert.equal(ret.type, 'response');
      assert.equal(ret.status, 'ok');
      assert.equal(ret.count, 1);
      assert.equal(msg.clientId, clientId);
      ws.close();
    })

    it('should return list of messages', async () => {
      const ws = await connect();
      const messages = await ws.send({
        type: 'load',
        channel: 'main', 
        limit: 5,
      })
      assert.equal(messages[0].type, 'message');
      assert.equal(messages.length, 6);
      ws.close();
    })

    it('should return error when channel is missing', async () => {
      const ws = await connect();
      const [ret] = await ws.send({
        type: 'load',
      }).catch(e=>e);
      assert.equal(ret.status, 'error');
      assert.equal(ret.message, 'MISSING_CHANNEL');
      ws.close();
    })

    it('should load messages from other channels', async () => {
      const ws = await connect();
      const messages = await ws.send({
        type: 'load',
        channel: 'test'
      });
      const ret = messages.pop();
      assert.equal(ret.status, 'ok');
      assert.deepEqual(messages, []);
      ws.close();
    });

    it('should control access to private channels', async () => {
      const ws = await connect();
      const channel = await (await db).collection('channels').findOne({name: 'Melisa'});
      const [ret] = await ws.send({
        type: 'load',
        channel: channel.cid,
      }).catch(e => e);
      assert.equal(ret.status, 'error');
      assert.equal(ret.message, 'ACCESS_DENIED');
      ws.close();
    });
  })
}
