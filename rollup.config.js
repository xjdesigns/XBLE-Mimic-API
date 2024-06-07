import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import multiEntry from 'rollup-plugin-multi-entry'
import { uglify } from 'rollup-plugin-uglify'

const isProduction = process.env.BUILD === 'production'

const extensions = [
  '.js', '.ts',
]

export default {
  input: 'src/index.ts',
  output: {
    file: 'lib/index.js',
    format: 'cjs'
  },
  plugins: [
    multiEntry(),
    babel({
      extensions,
      exclude: 'node_modules/**'
    }),
    resolve({
      extensions: [ '.ts', '.js', ]
    }),
    commonjs(),
    isProduction ? uglify() : null
  ]
};
