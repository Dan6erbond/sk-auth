const pkg = require("./package.json");

/** @type {import('vite').UserConfig} */
export default {
  ssr: {
    noExternal: Object.keys(pkg.dependencies || {}),
  },
};
