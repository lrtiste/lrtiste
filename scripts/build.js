const rollup = require('rollup');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

rollup
  .rollup({
    entry: './index.js',
    plugins: [nodeResolve({jsnext: true})]
  })
  .then(function (bundle) {
    return bundle.write({
      format: 'umd',
      dest: './dist/lrtiste.js',
      moduleName: 'lrtiste',
      sourceMap: true
    })
  })
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
