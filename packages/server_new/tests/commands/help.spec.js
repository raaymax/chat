const {
  match,
  partial,
} = require('../helpers');

module.exports = (sys) => {
  describe('/help', () => {
    it('should respond with help message', async () => {
      match(await sys.req({ type: 'command', cmd: 'help', args: [] }), [
        partial({
          type: 'message',
          priv: true,
          user: { name: 'System' },
        }),
        partial({ type: 'response', status: 'ok' }),
      ]);
    });
  });
};
