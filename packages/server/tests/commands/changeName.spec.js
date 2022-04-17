const {
  match,
  partial,
} = require('../helpers');

module.exports = (sys) => {
  describe('/name <new_name>', () => {
    it('should respond with error', async () => {
      match(await sys.req({ command: { name: 'name', args: ['mateusz'] } }), [
        partial({
          resp: {
            status: 'error',
          },
        }),
      ]);
    });
  });
};
