module.exports = (connect) => {
  describe('actions', () => {
    require('./message.spec')(connect);
    require('./typing.spec')(connect);
  });
};
