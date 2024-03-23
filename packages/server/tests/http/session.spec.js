const assert = require('assert');

module.exports = (agent) => {
  describe('session', () => {
    let cookies;
    it('user not logged in', async () => {
      await agent
        .get('/access')
        .expect(200, { status: 'no-session' });
    });

    it('login failed', async () => {
      await agent
        .post('/access')
        .send({ login: 'admin', password: '321' })
        .expect(401, { status: 'nok', message: 'Invalid credentials' });
    });

    it('login', async () => {
      await agent
        .post('/access')
        .send({ login: 'admin', password: '123' })
        .expect(200)
        .expect((res) => {
          cookies = res.headers['set-cookie'];
          assert.equal(res.body.status, 'ok');
        });
    });

    it('login should send userId instead of user');

    it('user logged in', async () => {
      await agent
        .get('/access')
        .set('Cookie', cookies)
        .expect(200)
        .expect((res) => {
          assert.equal(res.body.status, 'ok');
        });
    });

    it('user logout', async () => {
      await agent
        .delete('/access')
        .set('Cookie', cookies)
        .expect(204);
      await agent
        .get('/access')
        .set('Cookie', cookies)
        .expect(200, { status: 'no-session' });
    });
  });
};
