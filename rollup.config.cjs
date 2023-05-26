const svelte = require('rollup-plugin-svelte');
const commonjs = require('@rollup/plugin-commonjs');
const resolve = require('@rollup/plugin-node-resolve');
const livereload = require('rollup-plugin-livereload');
const terser = require('@rollup/plugin-terser');
const postcss = require('rollup-plugin-postcss');
const preprocess = require('svelte-preprocess');

const production = !process.env.ROLLUP_WATCH;

module.exports = {
    input: 'src/svelte.js',
    output: {
        sourcemap: true,
        format: 'iife',
        name: 'app',
        file: 'buildResources/bundle.js',
        inlineDynamicImports: true
    },
    plugins: [
        svelte({
            preprocess: preprocess(),
            compilerOptions: {
                // enable run-time checks when not in production
                dev: !production
            },
            emitCss: true
        }),
        // we'll extract any component CSS out into
        // a separate file - better for performance
        postcss({
            extract: true,
            minimize: true
        }),
        // If you have external dependencies installed from
        // npm, you'll most likely need these plugins. In
        // some cases you'll need additional configuration -
        // consult the documentation for details:
        // https://github.com/rollup/plugins/tree/master/packages/commonjs
        resolve({
            browser: true,
            dedupe: ['svelte']
        }),
        commonjs(),
        // Watch the `public` directory and refresh the
        // browser on changes when not in production
        !production && livereload('public'),
        // If we're building for production (npm run build
        // instead of npm run dev), minify
        production && terser()
    ],
    watch: {
        clearScreen: false
    }
};