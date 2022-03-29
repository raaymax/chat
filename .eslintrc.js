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
  overrides: [
    {
      files: ['public/sw.js'],
      env: {
        serviceworker: true,
        browser: true,
        es2021: true,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        self: 'readonly',
        cache: 'readonly',
      },
      rules: {
        'no-restricted-globals': ['off'],
        'import/extensions': ['off'],
      },
    },
    {
      files: ['public/tests/**/*.js'],
      env: {
        mocha: true,
        browser: true,
        es2021: true,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        chai: 'readonly',
      },
      rules: {
        'import/extensions': ['off'],
        'no-unused-expressions': 'off',
      },
    },
    {
      files: ['tests/**/*.js'],
      env: {
        mocha: true,
        commonjs: true,
        es2021: true,
      },
      rules: {
        'global-require': ['off'],
      },
    },
    {
      files: ['public/**/*.js'],
      env: {
        browser: true,
        es2021: true,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        Quill: 'readonly',
        QuillEmoji: 'readonly',
        EMOJI: 'writable',
      },
      rules: {
        'import/prefer-default-export': 'off',
        'import/extensions': ['off'],
      },
    },
  ],
  rules: {
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
