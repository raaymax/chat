module.exports = {
  port: process.env.PORT || 8080,
  sessionSecret: 'test keyboard cat',
  vapid: {
    publicKey: 'BMp9LOpPZ8I-lMGDPldXrQBQSbDjpqnY55KXrWKIOoNtZ4YxwP2B6vbq93AFgLE9E9kQhfoWzfn5LhqY73f3Vv4',
    privateKey: 'WQ3qOA9iG-TcgGfM-XQqngSL0Bs2UD9f4hKpH_cwIeE',
  },

  databaseUrl: process.env.DATABASE_URL,

  cors: [
    'https?://localhost(:[0-9]{,4})',
  ],
  fileStorage: process.env.NODE_ENV === 'test' ? 'memory' : 'gcs',
  serverWebUrl: 'http://localhost:8080',
  imagesUrl: 'http://localhost:8080',
};
