// In this file you can configure migrate-mongo
const appConfig = require('./config');

const config = {
  mongodb: {
    url: appConfig.databaseUrl,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.js',
  useFileHash: false,
  moduleSystem: 'commonjs',
};

module.exports = config;
