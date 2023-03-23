module.exports = (connect) => {
  describe('command:execute', () => {
    require('../commands')(connect);
  });
};
