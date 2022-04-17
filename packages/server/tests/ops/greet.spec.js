const {
  match,
  partial,
} = require('../helpers');

module.exports = (sys) => {
  describe('greet', () => {
    it('should respond with welcome message', async () => {
      match(await sys.req({ op: { type: 'greet' } }), [
        partial({
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
        partial({ resp: { status: 'ok' } }),
      ]);
    });
  });
};
