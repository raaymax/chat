const {EventEmitter} = require('events');

const bus = new EventEmitter();

module.exports = {
  direct: (userId, msg) => bus.emit(userId, {...msg, target: 'direct'}),
  broadcast: (msg) => bus.emit('all', {...msg, target: 'broadcast'}),
  on: (userId, cb) => {
    bus.on(userId, cb);
    bus.on('all', cb)
  },
  off: (userId, cb) => {
    bus.off(userId, cb);
    bus.off('all', cb)
  },
}
