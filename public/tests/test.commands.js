import con from '/js/connection.js';
const {expect} = chai;


describe('Commands', function () {
  it('/help should return info', function (done) {
    console.log('check');
    con.on('message', (srv, msg) => {
      expect(msg).to.not.be.undefined;
      done();
    })
    con.send({command: {name: 'help', args: []}});
  });
});
