const node = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
module.exports = {
  entry: './test/index.js',
  dest: './test/dist/index.js',
  format: 'iife',
  plugins: [node({}), commonjs()
    ,
    babel({
      presets: [
        'es2015-rollup'
      ],
      plugins: [["transform-runtime", {
        "helpers": false, // defaults to true
        "polyfill": false, // defaults to true
      }]]
    })
  ],
  moduleName: 'test',
  sourceMap: true
};