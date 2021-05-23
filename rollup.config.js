import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import multiInput from "rollup-plugin-multi-input";

// this override is needed because Module format cjs does not support top-level await
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require("./package.json");

const globals = {
  ...packageJson.devDependencies,
};

export default [
  {
    input: ["src/**/*.ts"],
    output: {
      dir: "dist",
      sourcemap: true,
      format: "cjs",
    },
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript(),
      multiInput(),
      commonjs({
        exclude: "node_modules",
        ignoreGlobal: true,
      }),
    ],
    external: Object.keys(globals),
  },
];
