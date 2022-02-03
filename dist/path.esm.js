function join(parts, sep = "/") {
  const separator = sep || "/";
  const replace = new RegExp(separator + "{1,}", "g");
  return parts.join(separator).replace(replace, separator);
}

export { join };
//# sourceMappingURL=path.esm.js.map
