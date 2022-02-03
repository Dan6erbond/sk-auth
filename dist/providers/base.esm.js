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

export { Provider };
//# sourceMappingURL=base.esm.js.map
