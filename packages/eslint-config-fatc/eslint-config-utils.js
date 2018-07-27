// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    srouceType: 'module'
  },
  env: {
    browser: true,
    node: true
  },
  extends: ['airbnb-base'],
  // check if imports actually resolve
  // add your custom rules here
  globals: {
    self: true
  },
  rules: {
    semi: ['error', 'never'],
    'no-param-reassign': [0],
    'comma-dangle': ['error', 'never'],
    // disallow reassignment of function parameters
    // disallow parameter object manipulation except for specific exclusions
    'no-param-reassign': ['off'],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'consistent-return': [0],
    'arrow-parens': [0],
    'no-underscore-dangle': [0],
    'prefer-destructuring': [0],
    'arrow-body-style': [0],
    'function-paren-newline': [0],
    'no-unused-expressions': [0],
    'prefer-template': [0],
    indent: [0],
    'no-nested-ternary': [0],
    'no-plusplus': [0]
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.json', '.json', '.ts', '.tsx']
      }
    }
  }
}
