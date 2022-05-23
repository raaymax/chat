const {
  match,
  partial,
} = require('../helpers');

module.exports = (sys) => {
  describe('greet', () => {
    it('should respond with welcome message', async () => {
      match(await sys.req({ type: 'greet' }), [
        partial({
          type: 'message',
          priv: true,
          user: { name: 'System' },
          message: [
            { text: 'Hello!' },
            { emoji: 'wave' },
            { br: true },
            { text: 'You can use "/help" to get more info' },
            { br: true },
            { text: 'You won\'t be able to send any messages until you login' },
            { br: true },
          ],
        }),
        partial({ type: 'response', status: 'ok' }),
      ]);
    });
  });
};
