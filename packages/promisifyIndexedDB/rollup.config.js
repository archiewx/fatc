const uglify = require('rollup-plugin-uglify')
const ts = require('rollup-plugin-typescript2')

module.exports = [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.common.js',
      format: 'cjs',
      sourcemap: 'inline',
      name: 'PmIndexed'
    },
    plugins: [ts()]
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.min.js',
      format: 'umd',
      name: 'PmIndexed',
      sourcemap: 'inline'
    },
    plugins: [ts(), uglify.uglify()]
  }
]
