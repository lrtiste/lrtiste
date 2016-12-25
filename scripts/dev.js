const fs = require('fs');
const rollup = require('rollup');
const node = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const path = require('path');
const cwd = process.cwd();

const buildTest = function () {
// used to track the cache for subsequent bundles

  console.log('dev:build');

  return rollup.rollup({
    entry: path.join(cwd, '/test/index.js'),
    plugins: [node({}), commonjs()
      // ,
      // babel({
      //   presets: [
      //     'es2015-rollup'
      //   ],
      //   plugins: [["transform-runtime", {
      //     "helpers": false, // defaults to true
      //     "polyfill": false, // defaults to true
      //   }]]
      // })
    ]
  }).then(function (bundle) {
    bundle.write({
      format: 'iife',
      dest: path.join(cwd, '/test/dist/index.js'),
      moduleName: 'Test',
      sourceMap: true
    });
  })
    .catch(e => console.log(e));
};


fs.watch(path.join(cwd, '/behaviours'), {}, buildTest);
fs.watch(path.join(cwd, '/components'), {}, buildTest);
fs.watch(path.join(cwd, '/test/behaviours'), {}, buildTest);
fs.watch(path.join(cwd, '/test/components'), {}, buildTest);
