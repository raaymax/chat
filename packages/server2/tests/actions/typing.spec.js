const assert = require('assert');

const {db} = require('../../src/infra/database');
const crypto = require('crypto');

module.exports = (connect) => {
  describe('typing', () => {
    it('should be received by other users', async () => {
      const melisa = await connect('melisa');
      const mateusz = await connect('mateusz');
      return new Promise(async (resolve, reject) => {
        try{
          melisa.on('type:typing', (msg) => {
            assert.equal(msg.type, 'typing');
            assert.equal(msg.channel, 'main');
            assert.equal(msg.userId, mateusz.userId);
            resolve();
          })
          await mateusz.send({
            type: 'typing',
            channel: 'main', 
          })
        }catch(err){
          reject(err);
        }
      }).catch(e=>{
        melisa.close();
        mateusz.close();
        throw e;
      }).then(() => {
        melisa.close();
        mateusz.close();
      });
    })

    it('should throw error when channel is not present', async () => {
      const ws = await connect();
      const [ret] = await ws.send({
        type: 'typing',
      }).catch(e=>e);
      assert.equal(ret.status, 'error');
      assert.equal(ret.message, 'MISSING_CHANNEL');
      ws.close();
    })
  })
}
