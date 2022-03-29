import con from '../js/connection.js';

const { expect } = chai;

describe('Commands', () => {
  it('/help should return info', (done) => {
    con.on('message', (srv, msg) => {
      expect(msg).to.not.be.undefined;
      done();
    });
    con.send({ command: { name: 'help', args: [] } });
  });
});
