const {
  match,
  partial,
} = require('../helpers');

module.exports = (sys) => {
  describe('ping', () => {
    it('should respond with ok', async () => {
      match(await sys.req({ op: { type: 'ping' } }), [
        partial({ resp: { status: 'ok' } }),
      ]);
    });
  });
};
