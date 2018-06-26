module.exports = {
  root: true,
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  env: {
    node: true,
    browser: true,
    jest: true
  },
  extends: ['prettier']
}
