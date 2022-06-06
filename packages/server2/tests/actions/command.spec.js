const assert = require('assert');

module.exports = (connect) => {
  describe('command', () => {
    require('../commands')(connect);
  })
}
