const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', 'node_modules/*', '.expo/*', 'web-build/*', 'coverage/*'],
  },
  {
    rules: {
      'react/display-name': 'off',
    },
  },
  eslintConfigPrettier,
]);
