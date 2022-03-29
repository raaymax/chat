const assert = require('assert');
const { knex } = require('../../src/database/db');
const {
  anyString,
  match,
} = require('../helpers');

module.exports = (sys) => {
  describe('restore', () => {
    let session;
    let user;
    beforeEach(async () => {
      const login = await sys.req({
        command: {
          name: 'login',
          args: ['mateusz', '123'],
        },
      });
      ({ session, user } = login[login.length - 1].resp.data);
    });

    it('should respond with ok and op:setSession', async () => {
      match(await sys.req({ op: { type: 'restore', session } }), [
        {
          op: {
            type: 'setSession',
            session: { id: anyString(), secret: anyString() },
            user: { id: anyString(), name: 'Mateusz' },
          },
        },
        {
          resp: {
            status: 'ok',
            data: {
              session: {
                id: anyString(),
                secret: anyString(),
              },
              user: {
                id: anyString(),
                name: 'Mateusz',
              },
            },
          },
        },
      ]);
      const sessions = await knex('sessions').select().where({ userId: user.id });
      assert(sessions.length > 0);
    });

    it('should invalidate all sessions if secrets dont match', async () => {
      match(await sys.req({ op: { type: 'restore', session: { ...session, secret: 'wrong' } } }), [
        { resp: { status: 'error', data: { code: 'SESSION_NOT_RESTORED' } } },
      ]);
      const sessions = await knex('sessions').select().where({ userId: user.id });
      assert.equal(sessions.length, 0);
    });

    it('should return error', async () => {
      match(await sys.req({ op: { type: 'restore', session: { id: 'wrong', secret: 'wrong' } } }), [
        { resp: { status: 'error', data: { code: 'VALIDATION_ERROR', message: anyString() } } },
      ]);
    });
  });
};
