'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function join(parts, sep = "/") {
  const separator = sep || "/";
  const replace = new RegExp(separator + "{1,}", "g");
  return parts.join(separator).replace(replace, separator);
}

exports.join = join;
//# sourceMappingURL=path.js.map
