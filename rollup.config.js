import fs from 'fs';
import typescript from '@rollup/plugin-typescript';
import pkg from "./package.json";

const ts_plugin = typescript({ include: 'src/**', typescript: require('typescript') });

function config(dir) {
  const _dir = dir ? dir + '/' : '';
  return {
    input: `src/${_dir}index.ts`,
    output: [
      {
        file: `${_dir}index.mjs`,
        format: 'esm'
      },
      {
        file: `${_dir}index.js`,
        format: 'cjs'
      }
    ],
    plugins: [
      typescript({ include: 'src/**', typescript: require('typescript') }),
      {
        writeBundle() {
          if (dir) {
            fs.writeFileSync(`${_dir}/package.json`, JSON.stringify({
              main: './index',
              module: './index.mjs',
              types: './index.d.ts'
            }, null, '  '));
          }
          fs.writeFileSync(`${_dir}index.d.ts`, `export * from '../types/${_dir}index';`);
        }
      }
    ],
    external: [
      ...Object.keys(pkg.dependencies),
      ...Object.keys(pkg.peerDependencies),
    ]
  }
}



/** @type {Array.<import('rollup').RollupOptions>} */
export default [config(), config('providers'), config('client')]