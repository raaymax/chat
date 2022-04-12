const {
  anyString,
  match,
  full,
  any,
  partial,
} = require('../helpers');

module.exports = (sys) => {
  describe('/login <name> <pass>', () => {
    it('should return ACCESS_DENIED for failed', async () => {
      match(await sys.req({ command: { name: 'login', args: ['mateusz', 'wrong'] } }), [
        partial({
          resp: {
            status: 'error',
            data: {
              errorCode: 'ACCESS_DENIED',
            },
          },
        }),
      ]);
    });
    it('should return successfull message', async () => {
      match(await sys.req({ command: { name: 'login', args: ['mateusz', '123'] } }), [
        partial({
          op: {
            type: 'setSession',
            user: full({
              id: anyString(),
              name: 'Mateusz',
              avatarUrl: any(),
            }),
            session: full({
              id: anyString(),
              secret: anyString(),
            }),
          },
        }),
        partial({
          priv: true,
          user: { name: 'System' },
          message: [
            { text: 'Login successfull' }, { br: true },
            { text: 'Welcome Mateusz' }, { br: true },
          ],
        }),
        partial({
          resp: {
            status: 'ok',
            data: {
              session: full({
                id: anyString(),
                secret: anyString(),
              }),
              user: full({
                id: anyString(),
                name: 'Mateusz',
                avatarUrl: any(),
              }),
            },
          },
        }),
      ]);
    });
  });
};
