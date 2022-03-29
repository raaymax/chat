module.exports = sys => {
  require('./greet.spec.js')(sys);
  require('./ping.spec.js')(sys);
  require('./typing.spec.js')(sys);
  require('./restore.spec.js')(sys);
}
