module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: [
    'eslint:recommended'
  ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true
    },
    ecmaVersion: 6,
    sourceType: 'module'
  },
  plugins: [],
  rules: {}
}
