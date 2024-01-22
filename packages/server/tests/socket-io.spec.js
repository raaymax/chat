const assert = require('assert');
const supertest = require('supertest');
const { io } = require('socket.io-client');
const server = require('../src/server');

const {
  request,
} = require('./helpers');

require('./helpers.spec');

describe('socket.io', () => {
  before((done) => server.listen(done()));
  after(async () => {
    server.close();
  });

  function con(opts) {
    return new Promise((resolve, reject) => {
      const socket = io(`http://localhost:${server.address().port}`, opts);
      socket.on('connect', () => resolve(socket));
      socket.on('connect_error', (err) => reject(err));
    });
  }

  it('should return 401 when unauthorized', async () => {
    try {
      await con();
      return Promise.reject(new Error('Should fail'));
    } catch (err) {
      assert.equal(err.message, 'unauthorized');
    }
  });

  async function connectWs(login = 'admin') {
    return supertest(server)
      .post('/session')
      .send({ login, password: '123' })
      .expect(200)
      .then(async (res) => ({
        ws: await con({
          auth: (cb) => cb({ token: res.body.token }),
          extraHeaders: {
            Cookie: res.headers['set-cookie'][0],
          },
        }),
        userId: res.body.user.id,
      }))
      .then((c) => request(c));
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
