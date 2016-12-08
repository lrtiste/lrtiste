const node = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
module.exports = {
  entry: './index.js',
  dest: './dist/index.js',
  format: 'umd',
  plugins: [node(), commonjs()],
  moduleName: 'lrtiste'
};