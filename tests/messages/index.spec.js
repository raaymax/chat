const {knex} = require('../../src/database/db');
const {
  anyString,
  full,
  match,
  partial,
} = require('../helpers');


module.exports = (sys) => {
  describe('simple', () => {
    after(async () => {
      await knex('messages').delete()
    });
    
    it('should respond with ok', async () => {
      await sys.req({command: {name: 'login', args: ['mateusz', '123']}});
      match(await sys.req({message: [{text: 'some message'}]}), [
        partial({
          id: anyString(),
          createdAt: anyString(),
          channel: 'main',
          flat: 'some message',
          message: [{text: 'some message'}],
          notify: true,
          user: {id: anyString(), name: 'Mateusz'},
          userId: anyString()
        }),
        partial({resp: {status: 'ok', data: {
          id: anyString(),
          createdAt: anyString(),
          channel: 'main',
          flat: 'some message',
          message: [{text: 'some message'}],
          notify: true,
          user: {id: anyString(), name: 'Mateusz'},
          userId: anyString()
        }}})
      ])
    })
    it('should respond with ok', async () => {
      await sys.req({command: {name: 'login', args: ['mateusz', '123']}});
      match(await sys.req({message: [{text: 'some message'}, {text: ' more'}]}), [
        partial({}),
        partial({resp: {status: 'ok', data: {
          flat: 'some message more',
        }}})
      ])
    })
  });

}

