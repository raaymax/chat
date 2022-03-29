module.exports = sys => {
  require('./login.spec.js')(sys);
  require('./changeName.spec.js')(sys);
  require('./help.spec.js')(sys);
  require('./channel.spec.js')(sys);
}
