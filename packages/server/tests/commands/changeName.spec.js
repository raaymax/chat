const {
  match,
  partial,
} = require('../helpers');

module.exports = (sys) => {
  describe('/name <new_name>', () => {
    it('should respond with error', async () => {
      match(await sys.req({ type: 'command', cmd: 'name', args: ['mateusz'] }), [
        partial({
          type: 'response',
          status: 'error',
        }),
      ]);
    });
  });
};
