import node from 'rollup-plugin-node-resolve';

export default {
    input: './src/index.js',
    output: [{
        file: './dist/citykleta-ui-kit.js',
        format: 'es'
    }, {
        file: './dist/index.mjs',
        format: 'es'
    }, {
        file: './dist/index.js',
        format: 'umd',
        name: 'CitykletaUI'
    }],
    plugins: [node()]
};