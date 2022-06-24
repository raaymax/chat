module.exports = (connect) => {
  describe('command', () => {
    require('../commands')(connect);
  });
};
