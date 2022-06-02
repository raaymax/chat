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
      match(await sys.req({ type: 'command', cmd: 'login', args: ['mateusz', 'wrong'] }), [
        partial({
          type: 'response',
          status: 'error',
          data: {
            errorCode: 'ACCESS_DENIED',
          },
        }),
      ]);
    });
    it('should return successfull message', async () => {
      match(await sys.req({ type: 'command', cmd: 'login', args: ['mateusz', '123'] }), [
        partial({
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
        }),
        partial({
          type: 'message',
          priv: true,
          user: { name: 'System' },
          message: [
            { text: 'Login successfull' }, { br: true },
            { text: 'Welcome Mateusz' }, { br: true },
          ],
        }),
        partial({
          type: 'response',
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
        }),
      ]);
    });
  });
  describe('/me', () => {
    it('should return user name and id', async () => {
      await sys.req({ type: 'command', cmd: 'login', args: ['mateusz', '123'] });
      match(await sys.req({ type: 'command', cmd: 'me' }), [
        {
          type: 'message',
          priv: true,
          user: { name: 'System' },
          message: [
            { text: 'ID: ' }, { text: anyString() }, { br: true },
            { text: 'User: ' }, { text: 'Mateusz' }, { br: true },
            { text: 'Avatar: ' }, { link: { href: anyString(), children: { text: anyString() } } }, { br: true },
          ],
        },
        { type: 'response', status: 'ok' },
      ]);
    });
  });
  describe('/logout', () => {
    it('should log user out', async () => {
      await sys.req({ type: 'command', cmd: 'login', args: ['mateusz', '123'] });
      match(await sys.req({ type: 'command', cmd: 'logout' }), [
        { type: 'rmSession' },
        { type: 'response', status: 'ok' },
      ]);
      match(await sys.req({ type: 'command', cmd: 'me' }), [
        { type: 'response', status: 'error' },
      ]);
    });
  });
};
