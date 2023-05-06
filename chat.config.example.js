module.exports = {
  port: 8080,
  sessionSecret: '',
  vapid: {
    publicKey: '',
    secretKey: '',
  },

  databaseUrl: process.env.DATABASE_URL,

  cors: [
    'https?://localhost(:[0-9]{,4})',
  ],
  fileStorage: process.env.NODE_ENV === 'test' ? 'memory' : 'gcs',
  gcsBucket: '',
  serverWebUrl: 'http://localhost:8080',
  imagesUrl: '',
};
