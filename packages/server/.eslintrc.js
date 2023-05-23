module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  ignorePatterns: [
    'node_modules/',
    'build/',
  ],
  overrides: [
    {
      files: [
        'tests/**/*.js',
        '**/*.spec.js',
      ],
      env: {
        mocha: true,
        commonjs: true,
        es2021: true,
      },
      rules: {
        'global-require': ['off'],
      },
    },
  ],
  rules: {
    'no-await-in-loop': 'off',
    'consistent-return': 'off',
    'no-use-before-define': 'off',
    'no-underscore-dangle': 'off',
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
    indent: [
      'error',
      2,
    ],
    'linebreak-style': [
      'error',
      'unix',
    ],
    quotes: [
      'error',
      'single',
    ],
    semi: [
      'error',
      'always',
    ],
  },
};
