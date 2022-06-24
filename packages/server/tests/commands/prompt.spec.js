/* eslint-disable no-unused-vars */
const assert = require('assert');
const { db } = require('../../src/infra/database');

module.exports = (connect) => {
  describe('/prompt <text>', () => {
    it('should work');
    it('crashing application because openai userId is string which cant be converted to ObjectId');
  });
};
