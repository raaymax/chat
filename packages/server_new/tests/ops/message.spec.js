const {
  anyString,
  match,
  any,
  partial,
} = require('../helpers');

module.exports = (sys) => {
  describe('simple', () => {
    it('should respond with ok', async () => {
      await sys.req({ type: 'command', cmd: 'login', args: ['mateusz', '123'] });
      match(await sys.req({ type: 'message', message: [{ text: 'some message' }], flat: 'some message' }), [
        partial({
          type: 'message',
          id: anyString(),
          createdAt: anyString(),
          channel: 'main',
          flat: 'some message',
          message: [{ text: 'some message' }],
          notify: true,
          user: { id: anyString(), name: 'Mateusz' },
          userId: anyString(),
        }),
        partial({
          type: 'response',
          status: 'ok',
          data: {
            id: anyString(),
            createdAt: anyString(),
            channel: 'main',
            flat: 'some message',
            message: [{ text: 'some message' }],
            notify: true,
            user: {
              id: anyString(),
              name: 'Mateusz',
              avatarUrl: any(),
            },
            userId: anyString(),
          },
        }),
      ]);
    });
  });
};
