const assert = require('assert');
const {
  partial,
  eq,
  any,
  anyString,
  exactArray,
} = require('./helpers');

describe('helpers', () => {
  it('eq', async () => {
    assert.deepEqual(eq(1)(1), []);
    assert.deepEqual(eq('a')('a'), []);
    assert.deepEqual(eq(1)(2), [{ msg: '1 !== 2' }]);
  });

  it('partial', async () => {
    assert.deepEqual(partial({ a: 1 })({ a: 1 }), []);
    assert.deepEqual(partial({ a: 1 })({ a: 1, b: 2 }), []);
    assert.deepEqual(partial({ a: 1, b: 2 })({ a: 1 }), [{ matched: { a: 1 }, msg: 'missing key: b' }]);
  });

  it('exactArray', async () => {
    assert.deepEqual(exactArray([])([]), []);
    assert.deepEqual(exactArray([() => []])(['anything']), []);
    assert.deepEqual(exactArray([() => []])([]), [{ expected: 1, matched: [], msg: 'length not match' }]);
    assert.deepEqual(exactArray([() => [{ msg: 'error' }]])(['anything']), [{ msg: 'error' }]);
  });

  it('exactArray + partial', async () => {
    assert.deepEqual(exactArray([partial({ a: 1 })])([{ a: 1 }]), []);
    assert.deepEqual(exactArray([
      partial({ a: 1, b: 2 }),
    ])([{ a: 1 }]), [
      { matched: { a: 1 }, msg: 'missing key: b' },
    ]);
    assert.deepEqual(exactArray([partial({ a: 1 })])([{ a: 1, b: 2 }]), []);
  });

  it('partial + plain array', async () => {
    assert.deepEqual(exactArray([partial({ a: [1, 2, 3] })])([{ a: [1, 2, 3] }]), []);
    assert.deepEqual(exactArray([partial({ a: [1, 2] })])([{ a: [1, 2, 3] }]), [{ expected: 2, matched: [1, 2, 3], msg: 'length not match' }]);
    assert.deepEqual(exactArray([partial({ a: [1, 2, 4] })])([{ a: [1, 2, 3] }]), [{ msg: '4 !== 3' }]);
  });

  it('anyString', async () => {
    assert.deepEqual(anyString()('asd'), []);
    assert.deepEqual(anyString()(1), [{ v: 1, msg: 'is not string' }]);
    assert.deepEqual(anyString()(), [{ v: undefined, msg: 'is not string' }]);
  });

  it('any', async () => {
    assert.deepEqual(any()('asd'), []);
    assert.deepEqual(any()(1), []);
    assert.deepEqual(any()(), [{ msg: 'is undefined' }]);
  });
});
