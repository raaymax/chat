const {knex} = require('../src/database/db');
const server = require('../src/server');
const {
  connect, 
  request,
} = require('./helpers');

require('./helpers.spec.js');

describe('server', () => {
  let sys = {};
  before((done) => server.listen(done));
  after(() => {
    server.close();
    return knex.destroy();
  });

  beforeEach(async () => { 
    sys.ws = await connect();
    sys.req = request(sys.ws);
  });

  afterEach(() => sys.ws.close());


  describe('ops', () => {
    require('./ops/index.spec.js')(sys);
  });
  describe('commands', () => {
    require('./commands/index.spec.js')(sys);
  })
  describe('messages', () => {
    require('./messages/index.spec.js')(sys);
  });
})
