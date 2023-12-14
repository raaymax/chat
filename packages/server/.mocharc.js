module.exports = {
  'allow-uncaught': false,
  bail: false,
  'check-leaks': true,
  color: true,
  delay: false,
  diff: true,
  exit: false,
  extension: ['js'],
  'full-trace': false,
  ignore: ['./node_modules'],
  'inline-diffs': false,
  jobs: 1,
  file: ['tests/index.spec.js'],
  package: './package.json',
  parallel: false,
  recursive: false,
  reporter: 'spec',
  require: './tests/environment.js',
  retries: 1,
  slow: '75',
  sort: false,
  spec: ['src/app/**/*.spec.js'],
  timeout: '2s',
  ui: 'bdd',
  //watch: false,
  //'watch-files': ['**/*.js'],
  //'watch-ignore': ['./node_modules'],
};
