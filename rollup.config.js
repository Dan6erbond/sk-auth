import multiInput from "rollup-plugin-multi-input";
import packageJson from "./package.json";
import esbuild from "rollup-plugin-esbuild";

const globals = {
  ...packageJson.dependencies,
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
      esbuild(),
      multiInput(),
    ],
    external: [
      ...Object.keys(globals),
      "@sveltejs/kit/assets/runtime/app/navigation",
      "@sveltejs/kit/assets/runtime/app/stores",
    ],
  },
];
