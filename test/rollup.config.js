const node = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
module.exports = {
  entry: './test/behaviours/index.js',
  dest: './test/dist/index.js',
  format: 'cjs',
  plugins: [node({}), commonjs(), babel({
    presets:['es2015-rollup']
  })]
};