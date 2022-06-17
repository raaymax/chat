const assert = require('assert');
const path = require('path');

module.exports = (agent) => {
  describe('file', () => {
    it('should upload simple file', async () => agent
      .post('/files')
      .attach('file', path.join(__dirname, 'test.txt'))
      .expect(200)
      .expect((res) => {
        assert.equal(res.body.status, 'ok');
      }));
    it('should be able to download uploaded file', async () => {
      const ret = await agent
        .post('/files')
        .attach('file', path.join(__dirname, 'test.txt'))
        .expect(200);

      return agent
        .get(`/files/${ret.body.fileId}`)
        .expect('Content-Type', /text/)
        .expect(200)
        .expect((res) => {
          assert.equal(res.text, 'some text\n');
        });
    });

    it('should be able to download uploaded file', async () => agent
      .get('/files/random')
      .expect(404));
  });
};
