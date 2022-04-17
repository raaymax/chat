const {
  anyString,
  any,
  match,
} = require('../helpers');

module.exports = (sys) => {
  describe('restore', () => {
    let session;
    beforeEach(async () => {
      const login = await sys.req({
        command: {
          name: 'login',
          args: ['mateusz', '123'],
        },
      });
      ({ session } = login[login.length - 1].resp.data);
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
                avatarUrl: any(),
              },
            },
          },
        },
      ]);
    });

    it('should invalidate all sessions if secrets dont match', async () => {
      match(await sys.req({ op: { type: 'restore', session: { ...session, secret: 'wrong' } } }), [
        { resp: { status: 'error', data: { errorCode: 'SESSION_TERMINATED' } } },
      ]);
    });

    it('should return error', async () => {
      match(await sys.req({ op: { type: 'restore', session: { id: 'wrong' } } }), [
        { resp: { status: 'error', data: { errorCode: 'VALIDATION_ERROR', message: anyString() } } },
      ]);
    });
  });
};
