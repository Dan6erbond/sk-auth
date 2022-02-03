'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

class Provider {
  constructor(config) {
    this.config = config;
    this.id = config.id;
  }
  getUri(svelteKitAuth, path, host) {
    return svelteKitAuth.getUrl(path, host);
  }
  getCallbackUri(svelteKitAuth, host) {
    return this.getUri(svelteKitAuth, `${"/callback/"}${this.id}`, host);
  }
  getSigninUri(svelteKitAuth, host) {
    return this.getUri(svelteKitAuth, `${"/signin/"}${this.id}`, host);
  }
}

exports.Provider = Provider;
//# sourceMappingURL=base.js.map
