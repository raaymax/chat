// Update with your config settings.
module.exports = {
  client: 'pg',
  connection: process.env.DATABASE_URL || 'postgres://chat:chat@localhost:5432/chat',
};
