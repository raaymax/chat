const server = require('../src/server');
const {
  connect,
  request,
} = require('./helpers');

require('./helpers.spec');

describe('server', () => {
  const sys = {};
  before((done) => server.listen(done));
  after(() => {
    server.close();
  });

  beforeEach(async () => {
    sys.ws = await connect();
    sys.req = request(sys.ws);
  });

  afterEach(() => sys.ws.close());

  describe('ops', () => {
    require('./ops/index.spec')(sys);
  });
  describe('commands', () => {
    require('./commands/index.spec')(sys);
  });
  describe('messages', () => {
    require('./messages/index.spec')(sys);
  });
});
