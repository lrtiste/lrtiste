import node from 'rollup-plugin-node-resolve';

import pkg from '../package.json';

export default {
    input: './src/index.js',
    output: [{
        file: `./dist/${pkg.name}.js`,
        format: 'es'
    }, {
        file: `./dist/${pkg.name}.mjs`,
        format: 'es'
    }],
    plugins: [node()]
};
