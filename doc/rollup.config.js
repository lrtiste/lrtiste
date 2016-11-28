const node = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
module.exports = {
  entry: './doc/theme.js',
  dest:'./dist/doc/theme.js',
  format: 'es',
  plugins: [node(), commonjs()],
  moduleName:'lrtiste'
};