const {
  match,
  partial,
} = require('../helpers');

module.exports = (sys) => {
  describe('ping', () => {
    it('should respond with ok', async () => {
      match(await sys.req({type: 'ping' }), [
        partial({ type: 'response', status: 'ok' }),
      ]);
    });
  });
};
