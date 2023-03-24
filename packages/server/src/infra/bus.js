const { EventEmitter } = require('events');

const bus = new EventEmitter();
bus.setMaxListeners(100);

// FIXME!: onlu users from specific channel should be informed about message
module.exports = {
  direct: (userId, msg) => bus.emit(userId, { ...msg, _target: 'direct' }),
  broadcast: (msg) => bus.emit('all', { ...msg, _target: 'broadcast' }),
  on: (userId, cb) => {
    bus.on(userId, cb);
    bus.on('all', cb);
  },
  off: (userId, cb) => {
    bus.off(userId, cb);
    bus.off('all', cb);
  },
};
