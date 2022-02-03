'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var helpers = require('../helpers.js');
var providers_oauth2_base = require('./oauth2.base.js');
require('./base.js');

const defaultConfig = {
  responseType: "code",
  grantType: "authorization_code",
  contentType: "application/json"
};
class OAuth2Provider extends providers_oauth2_base.OAuth2BaseProvider {
  constructor(config) {
    super({
      ...defaultConfig,
      ...config
    });
  }
  getAuthorizationUrl({ url }, auth, state, nonce) {
    const data = {
      state,
      nonce,
      response_type: this.config.responseType,
      client_id: this.config.clientId,
      scope: Array.isArray(this.config.scope) ? this.config.scope.join(" ") : this.config.scope,
      redirect_uri: this.getCallbackUri(auth, url.host),
      ...this.config.authorizationParams ?? {}
    };
    const authUrl = `${this.config.authorizationUrl}?${new URLSearchParams(data)}`;
    return authUrl;
  }
  async getTokens(code, redirectUri) {
    const data = {
      code,
      grant_type: this.config.grantType,
      client_id: this.config.clientId,
      redirect_uri: redirectUri,
      client_secret: this.config.clientSecret,
      ...this.config.params ?? {}
    };
    let body;
    if (this.config.contentType === "application/x-www-form-urlencoded") {
      body = Object.entries(data).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join("&");
    } else {
      body = JSON.stringify(data);
    }
    const res = await fetch(this.config.accessTokenUrl, {
      body,
      method: "POST",
      headers: {
        "Content-Type": this.config.contentType,
        ...this.config.headers ?? {}
      }
    });
    return await res.json();
  }
  async getUserProfile(tokens) {
    const res = await fetch(this.config.profileUrl, {
      headers: { Authorization: `${helpers.ucFirst(tokens.token_type)} ${tokens.access_token}` }
    });
    return await res.json();
  }
}

exports.OAuth2Provider = OAuth2Provider;
//# sourceMappingURL=oauth2.js.map
