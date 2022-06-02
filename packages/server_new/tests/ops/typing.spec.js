const {
  anyString,
  match,
  partial,
} = require('../helpers');

module.exports = (sys) => {
  describe('typing', () => {
    it('should respond with error if not logged in', async () => {
      match(await sys.req({ type: 'typing' }), [
        partial({ type: 'response', status: 'error', data: { errorCode: 'ACCESS_DENIED' } }),
      ]);
    });
    it('should respond with ok and op:typing', async () => {
      await sys.req({ type: 'command', cmd: 'login', args: ['mateusz', '123'] });
      match(await sys.req({ type: 'typing' }), [
        partial({
          type: 'typing',
          user: { id: anyString(), name: 'Mateusz' },
          senderId: anyString(),
          userId: anyString(),
        }),
        partial({ type: 'response', status: 'ok' }),
      ]);
    });
  });
};
