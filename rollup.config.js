import typescript from '@rollup/plugin-typescript';
import dts from "rollup-plugin-dts";

const config = [
  {
    input: 'build/index.js',
    output: {
      file: 'lib/index.js',
      format: 'cjs',
      sourcemap: true,
    },
    external: ['axios'],
    plugins: [typescript()]
  }, {
    input: 'build/index.d.ts',
    output: {
      file: 'lib/index.d.ts',
      format: 'es'
    },
    plugins: [dts()]
  }
];export default config;