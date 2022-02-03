import { ucFirst } from '../helpers.esm.js';
import { OAuth2BaseProvider } from './oauth2.base.esm.js';
import './base.esm.js';

const defaultConfig = {
  responseType: "code",
  grantType: "authorization_code",
  contentType: "application/json"
};
class OAuth2Provider extends OAuth2BaseProvider {
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
      headers: { Authorization: `${ucFirst(tokens.token_type)} ${tokens.access_token}` }
    });
    return await res.json();
  }
}

export { OAuth2Provider };
//# sourceMappingURL=oauth2.esm.js.map
