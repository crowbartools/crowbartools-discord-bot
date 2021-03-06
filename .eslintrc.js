module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
      '@typescript-eslint',
    ],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended',
      "prettier/@typescript-eslint",
      "plugin:prettier/recommended"
    ],

    rules: {
      "no-console": 0,
      "@typescript-eslint/interface-name-prefix": 0,
    },
    env: {
      node: true,
    },
    parserOptions: {
      ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
      sourceType: "module" // Allows for the use of imports
    }
};