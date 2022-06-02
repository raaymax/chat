const server = require('../src/server');
const assert = require('assert');
const { ObjectId, MongoClient } = require('mongodb');
const config = require('../../../chat.config');
const client = new MongoClient(config.databaseUrl);
async function run() {
  await client.connect();
  return client.db();
}
const supertest = require('supertest');

const {
  connect,
  request,
} = require('./helpers');

require('./helpers.spec');

describe('socket', () => {
  before((done) => server.listen(done()));
  after(async () => {
    server.close();
  });

  it('should return 401 when unauthorized', async () => {
    try{ 
      await connect();
    }catch(err){
      assert(err.message, 'Unexpected server response: 401');
    }
  })

  async function connectWs(){
    return supertest(server)
        .post('/session')
        .send({login: 'mateusz', password: '123'})
        .expect(200)
        .then(async res => {
          return connect({
            headers: {
              Cookie: res.headers['set-cookie'][0],
            }});
        })
        .then(ws => request(ws))

  }

  it('should connect with correct cookies', async () => {
    await connectWs();
  })
  
  it('should receive response for ping', async () => {
    const req = await connectWs();
    const [msg] = await req({ type: 'ping' })
    assert(msg.status, 'ok');
  })

  it('should return error on unknown action type', async () => {
    const req = await connectWs();
    const [msg] = await req({ type: 'unknown' })
    assert(msg.status, 'error');
    assert(msg.message, 'Unknown command');
  })

  it('should return error on unknown action type', async () => {
    const req = await connectWs();
    const [msg] = await req({ type: 'unknown' })
    assert(msg.status, 'error');
    assert(msg.message, 'Unknown command');
  })
});
