const assert = require('assert');
const supertest = require('supertest');
const server = require('../src/server');

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
    try {
      await connect();
    } catch (err) {
      assert(err.message, 'Unexpected server response: 401');
    }
  });

  async function connectWs(login = 'admin') {
    return supertest(server)
      .post('/session')
      .send({ login, password: '123' })
      .expect(200)
      .then(async (res) => ({
        ws: await connect({
          headers: {
            Cookie: res.headers['set-cookie'][0],
          },
        }),
        userId: res.body.user.id,
      }))
      .then((con) => request(con));
  }

  it('should receive response for ping', async () => {
    const ws = await connectWs();
    const [msg] = await ws.send({ type: 'ping:send' });
    assert.equal(msg.status, 'ok');
    ws.close();
  });

  it('should return error on unknown action type', async () => {
    const ws = await connectWs();
    const [msg] = await ws.send({ type: 'unknown' }).catch((err) => err);
    assert.equal(msg.status, 'error');
    assert.equal(msg.message, 'Unknown action');
    ws.close();
  });

  require('./actions')(connectWs);
});
