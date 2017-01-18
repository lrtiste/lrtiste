const rollup = require('rollup');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

rollup
  .rollup({
    entry: './index.js',
    plugins: [ nodeResolve({ jsnext: true, main: true }), commonjs() ]
  })
  .then(function(bundle) {
    return Promise.all(
      [
        bundle.write({
          format: 'es',
          dest: './dist/lrtiste.es.js',
          sourceMap: true
        })
      ],
      bundle.write({
        format: 'umd',
        dest: './dist/lrtiste.js',
        moduleName: 'lrtiste',
        sourceMap: true
      })
    );
  });
