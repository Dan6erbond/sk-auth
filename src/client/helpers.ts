export function mergePath(basePaths: (string | null)[], path: string) {
  if (path.startsWith("/")) {
    path = path.slice(1);
  }
  let retPath;
  for (let basePath of basePaths) {
    if (basePath !== null) {
      if (!basePath.startsWith("/")) {
        basePath = "/" + basePath;
      }
      if (!basePath.endsWith("/")) {
        basePath = basePath + "/";
      }
      retPath = basePath + path;
    }
  }

  return retPath;
}
