
import {expect} from 'chai/chai.js';

describe('client', () => {
  before(async () => {
    const res = await fetch('/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ login: 'mateusz', password: '123' }),
    });
  });

  it('should connect', async () => new Promise((resolve, reject) => {
    const ws = new WebSocket('ws://localhost:8080/ws');
    ws.addEventListener('open', () => resolve(ws));
    ws.addEventListener('error', (err) => reject(err));
  }));

  it('should reconnect every hour');
  it('should reconnect on disconnect');
  it('should heartbeat');
});
