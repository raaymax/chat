module.exports = {
  vapid: {
    public: '',
    secret: '',
  },
  databaseUrl: 'mongodb://chat:chat@localhost:27017/chat?authSource=admin',

  cors: [
    'http://localhost:8080',
  ],

  gcsBucket: '',
  serverUrl: 'ws://localhost:8080/ws',
  serverWebUrl: 'http://localhost:8080',
  openaiApiKey: '',
  sentryDns: '',
  firebase: {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: '',
  },
};
