module.exports = {
  extends: ['eslint:recommended', 'airbnb-base', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
  },
  ignorePatterns: [
    'packages/app/dist',
    'packages/rpc/dist',
    'packages/repo/dist',
    'plugins/todo/dist',
    'chat.config.js',
    '**/dist/**/*',
  ],
  overrides: [
    {
      files: [
        'packages/app/src/sw.js',
      ],
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
      files: [
        'packages/app/tests/**/*.js',
        'packages/app/**/*.spec.js',
      ],
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
      files: [
        'packages/server/tests/**/*.js',
        'packages/server/**/*.spec.js',
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
    {
      files: [
        'plugins/*/public/**/*.js',
      ],
      extends: 'preact',
      env: {
        browser: true,
        es2021: true,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        Chat: 'readonly',
        Preact: 'readonly',
        PreactHooks: 'readonly',
        plugins: 'readonly',
      },
      rules: {
        'jest/no-deprecated-functions': 'off',
        'import/prefer-default-export': 'off',
        'import/extensions': ['off'],
      },
    },
    {
      files: [
        'packages/app/**/*.js',
      ],
      extends: 'preact',
      env: {
        browser: true,
        es2021: true,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        EMOJI: 'writable',
      },
      rules: {
        'jest/no-deprecated-functions': 'off',
        'import/prefer-default-export': 'off',
        'import/extensions': ['off'],
      },
    },
    {
      files: [
        '**/*.ts',
      ],
      rules: {
        'no-useless-constructor': 'off',
        'import/no-unresolved': 'off',
        'no-redeclare': 'off',
        'no-unused-vars': 'off',
      },
    },
    {
      files: [
        '**/*.js',
      ],
      rules: {
        '@typescript-eslint/no-empty-function': 'warn',
        '@typescript-eslint/no-var-requires': 'off',
        'import/no-unresolved': [2, { commonjs: true }],
      },
    },
  ],
  rules: {
    'max-len': [
      'error',
      {
        code: 120,
        ignoreComments: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      },
    ],
    '@typescript-eslint/no-unused-vars': ['warn', { varsIgnorePattern: '^_' }],
    'import/extensions': [1, 'never'],
    'import/prefer-default-export': 'off',
    'class-methods-use-this': 'off',
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
