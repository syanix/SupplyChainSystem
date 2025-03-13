module.exports = {
  root: true,
  extends: ['../../.eslintrc.js', 'next/core-web-vitals', 'prettier'],
  plugins: ['prettier'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        moduleDirectory: ['node_modules', 'src/'],
      },
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
  env: {
    node: true,
    commonjs: true,
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    'import/no-named-as-default': 'warn',
    'prettier/prettier': 'warn',
    'import/no-unresolved': 'off',
  },
  overrides: [
    {
      files: ['.eslintrc.js'],
      parser: 'espree',
      parserOptions: {
        ecmaVersion: 2020,
      },
    },
  ],
};
