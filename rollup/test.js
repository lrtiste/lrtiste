import node from 'rollup-plugin-node-resolve';

export default {
    input: './test/index.js',
    output: {
        file: './test/dist/debug.js',
        sourcemap: true,
        format: 'es'
    },
    plugins: [node()]
};