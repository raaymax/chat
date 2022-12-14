const assert = require('assert');
const WebSocket = require('ws');
const crypto = require('crypto');
const { EventEmitter } = require('events');
const server = require('../src/server');

const connect = (opts) => new Promise((resolve, reject) => {
  const ws = new WebSocket(`ws://localhost:${server.address().port}/ws`, opts);
  ws.addEventListener('open', () => resolve(ws));
  ws.addEventListener('error', (err) => reject(err));
});

const request = (con) => {
  const bus = new EventEmitter();
  con.ws.addEventListener('message', (msg) => {
    bus.emit(`type:${msg.type}`, msg);
    bus.emit('message', msg);
  });
  return ({
    userId: con.userId,
    close: () => {
      bus.removeAllListeners();
      con.ws.close();
    },
    ws: con.ws,
    on: (ev, handler) => bus.on(ev, handler),
    off: (ev, handler) => bus.off(ev, handler),
    send: (msg) => {
      const id = crypto.randomBytes(4).toString('hex');

      return new Promise((resolve, reject) => {
        const list = [];
        const handler = (pmsg) => {
          if (pmsg.seqId !== id) return;
          list.push(pmsg);
          if (pmsg.type === 'response') {
            bus.off('message', handler);
            if (pmsg.status === 'error') {
              return reject(list);
            }
            resolve(list);
          }
        };
        bus.on('message', handler);
        con.ws.send({ seqId: id, ...msg });
      }).catch((e) => e);


    },
  });
};
const eq = (expected) => (matched) => {
  if (expected !== matched) {
    return [{ msg: `${expected} !== ${JSON.stringify(matched)}` }];
  }
  return [];
};

const parts = [
  { match: (e) => Array.isArray(e), run: (e) => exactArray(e) },
  { match: (e) => typeof e === 'object' && e !== null, run: (e) => partial(e) },
  { match: (e) => typeof e === 'function', run: (e) => e },
  { match: () => true, run: (e) => eq(e) },
];

const check = (e) => parts.find((i) => i.match(e)).run(e);

const any = () => (v) => (typeof v === 'undefined' ? [{ msg: 'is undefined' }] : []);

const anyString = () => (v) => (typeof v !== 'string' ? [{ v, msg: 'is not string' }] : []);

function full(expected) {
  const list = Object.keys(expected)
    .map((key) => [key, check(expected[key])]);
  return function m(matched) {
    if (typeof matched === 'undefined') { return [{ msg: `is undefined expected: ${JSON.stringify(expected)}` }]; }
    const expectedKeys = Object.keys(expected);
    const c = expectedKeys
      .map((key) => (typeof matched[key] === 'undefined'
        ? [{ msg: `missing key: ${key}`, matched }]
        : [])).flat();
    const c0 = Object.keys(matched).filter((key) => !expectedKeys.includes(key));
    if (c0.length) return [{ matched, fields: c0, msg: 'unexpected fields' }];

    if (c.length) return c;
    return list.map(((i) => i[1](matched[i[0]]))).flat();
  };
}

function partial(expected) {
  const list = Object.keys(expected)
    .map((key) => [key, check(expected[key])]);
  return function m(matched) {
    if (typeof matched === 'undefined') { return [{ msg: `is undefined expected: ${JSON.stringify(expected)}` }]; }
    const c = Object.keys(expected).map((key) => (typeof matched[key] === 'undefined' ? [{ msg: `missing key: ${key}`, matched }] : [])).flat();
    if (c.length) return c;
    return list.map(((i) => i[1](matched[i[0]]))).flat();
  };
}
const exactArray = (expected) => (matched) => {
  if (!Array.isArray(matched)) return [{ msg: 'not an array' }];
  if (expected.length !== matched.length) {
    return [{
      expected: expected.length,
      expectedSchema: expected,
      matched,
      msg: 'length not match',
    }];
  }
  const res = expected.map((m, idx) => check(m)(matched[idx])).flat();
  return res;
};

const match = (matched, expected) => {
  assert.deepEqual(exactArray(expected)(matched), []);
};

module.exports = {
  connect,
  request,
  match,
  partial,
  check,
  eq,
  full,
  any,
  anyString,
  exactArray,
};
