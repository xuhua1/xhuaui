import babel from 'rollup-plugin-babel';
import clear from 'rollup-plugin-clear';
// import path from 'path';

export default {
  input: './src/index.js',
  output: {
    file: './lib/bundle.js',
    format: 'cjs'
  },
  plugins: [clear({targets: ['lib']}), babel()],
  external: ['react', 'styled-components']
};