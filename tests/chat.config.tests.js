module.exports = {
  port: process.env.PORT || 8080,
  sessionSecret: 'test keyboard cat',
  vapid: {
    public: 'BDUZ2J_pJn25op7SY_zq_4qqW1wV-wttUCW2FHFFdF65dGNlxWVO8SJL2YuCcnOtxluHQY_JqcDtPMRBqF6c6uE',
    secret: 'jUSTaXOghTmsSRuKIhmtzL4IWv98r0ueLnhBiJ3RMPU',
  },

  databaseUrl: process.env.DATABASE_URL,

  cors: [
    'https?://localhost(:[0-9]{,4})',
  ],
  fileStorage: process.env.NODE_ENV === 'test' ? 'memory' : 'gcs',
  serverWebUrl: 'http://localhost:8080',
  imagesUrl: 'http://localhost:8080',
  firebase: null,
};
