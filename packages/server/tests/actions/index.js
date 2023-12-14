module.exports = (connect) => {
  describe('actions', () => {
    require('./message.spec')(connect);
    require('./setupFcm.spec')(connect);
    require('./typing.spec')(connect);
    require('./command.spec')(connect);
  });
};
