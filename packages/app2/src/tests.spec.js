import 'mocha/mocha.css';
import mocha from 'mocha/mocha.js';
import { expect } from 'chai/chai.js';

mocha.setup('bdd');
mocha.checkLeaks();

describe('session service', () => {
  before(async () => {
    await fetch('/session', { method: 'DELETE' });
  });

  it('should inform abount wrong session', async () => {
    const res = await fetch('/session', { method: 'GET' });
    const data = await res.json();
    expect(data).to.have.property('status', 'NO_SESSION');
  });

  it('should error on wrong credentials', async () => {
    const res = await fetch('/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ login: 'mateusz', password: 'wrong' }),
    });
    const data = await res.json();
    expect(data).to.have.property('status', 'NOT_AUTHORIZED');
  });

  it('should reject unauthorized connection', async () => new Promise((resolve, reject) => {
    const ws = new WebSocket('ws://localhost:8080/ws');
    ws.addEventListener('open', () => reject());
    ws.addEventListener('error', () => resolve());
  }));

  it('should login', async () => {
    const res = await fetch('/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ login: 'mateusz', password: '123' }),
    });
    const data = await res.json();
    expect(data).to.have.property('status', 'OK');
  });

  it('should connect', async () => new Promise((resolve, reject) => {
    const ws = new WebSocket('ws://localhost:8080/ws');
    ws.addEventListener('open', () => resolve(ws));
    ws.addEventListener('error', (err) => reject(err));
  }));

  it('should reconnect every hour')
  it('should reconnect on disconnect')
  it('should heartbeat')

});

mocha.run();
