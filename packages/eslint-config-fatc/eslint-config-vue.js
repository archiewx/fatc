// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 6,
    sourceType: 'module'
  },
  env: {
    browser: true
  },
  // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
  // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
  extends: ['plugin:vue/essential', 'airbnb-base'],
  // required to lint *.vue files
  plugins: ['vue'],
  // add your custom rules here
  rules: {
    'prefer-destructuring': [0],
    'no-underscore-dangle': [0],
    'no-shadow': [0],
    'consistent-return': [0],
    'no-console': [0],
    'max-len': [0],
    'function-paren-newline': [0],
    'no-mixed-operators': [0],
    'no-unused-expressions': [0],
    semi: ['error', 'never'],
    'no-shadow': ['error', { hoist: 'functions', allow: ['state'] }],
    'comma-dangle': ['error', 'never'],
    'arrow-parens': ['error', 'always'], // 箭头函数总是需要括号
    // disallow reassignment of function parameters
    // disallow parameter object manipulation except for specific exclusions
    'no-param-reassign': ['off'],
    'no-underscore-dangle': [0],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-underscore-dangle': [0],
    'consistent-return': [0],
    'no-console': [0],
    'max-len': [0],
    'function-paren-newline': [0]
  }
}
