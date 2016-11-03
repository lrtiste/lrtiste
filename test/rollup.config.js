const node = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
module.exports = {
  entry: './test/index.js',
  dest: './test/dist/index.js',
  format: 'umd',
  plugins: [node(), commonjs()]
};