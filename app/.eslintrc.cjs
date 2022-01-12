module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: ["../.eslintrc-shared.cjs"],
  plugins: ["svelte3"],
  overrides: [
    {
      files: ["*.svelte"],
      processor: "svelte3/svelte3",
    },
  ],
  settings: {
    "svelte3/typescript": () => require("typescript"),
  },
};
