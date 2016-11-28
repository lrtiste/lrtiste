const node = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
module.exports = {
  // entry:'./index.js',
  // dest: './dist/index.js',
  entry: './doc/tooltips.js',
  dest:'./dist/tooltips.js',
  format: 'es',
  plugins: [node(), commonjs()],
  moduleName:'lrtiste'
};