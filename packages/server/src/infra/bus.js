const { EventEmitter } = require('events');

const bus = new EventEmitter();
bus.setMaxListeners(1000);

// FIXME!: onlu users from specific channel should be informed about message
module.exports = {
  hasKey: (userId) => bus.eventNames().includes(userId),
  getListeners: () => bus.eventNames().reduce((acc, ev) => ({ ...acc, [ev]: bus.listenerCount(ev) }), {}),
  group: (userIds, msg) => (userIds ?? []).forEach((userId) => bus.emit(userId, { ...msg, _target: 'group' })),
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
