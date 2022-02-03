import { OAuth2BaseProvider } from './oauth2.base.esm.js';
import './base.esm.js';

const defaultConfig = {
  id: "twitter"
};
class TwitterAuthProvider extends OAuth2BaseProvider {
  constructor(config) {
    super({
      ...defaultConfig,
      ...config
    });
  }
  async getRequestToken(auth, host) {
    const endpoint = "https://api.twitter.com/oauth/request_token";
    const data = {
      oauth_callback: encodeURIComponent(this.getCallbackUri(auth, host)),
      oauth_consumer_key: this.config.apiKey
    };
    const res = await fetch(`${endpoint}?${new URLSearchParams(data)}`, { method: "POST" });
    const { oauth_token, oauth_token_secret, oauth_callback_confirmed } = await res.json();
    return {
      oauthToken: oauth_token,
      oauthTokenSecret: oauth_token_secret,
      oauthCallbackConfirmed: oauth_callback_confirmed
    };
  }
  async getAuthorizationUrl({ url }, auth, state, nonce) {
    const endpoint = "https://api.twitter.com/oauth/authorize";
    const { oauthToken } = await this.getRequestToken(auth, url.host);
    const data = {
      oauth_token: oauthToken
    };
    const authUrl = `${endpoint}?${new URLSearchParams(data)}`;
    return authUrl;
  }
  async getTokens(oauthToken, oauthVerifier) {
    const endpoint = "https://api.twitter.com/oauth/access_token";
    const data = {
      oauth_consumer_key: this.config.apiKey,
      oauth_token: oauthToken,
      oauth_verifier: oauthVerifier
    };
    const res = await fetch(`${endpoint}?${new URLSearchParams(data)}`, { method: "POST" });
    return await res.json();
  }
  async getUserProfile({ oauth_token, oauth_token_secret: _ }) {
    const endpoint = "https://api.twitter.com/1.1/account/verify_credentials.json";
    const res = await fetch(endpoint, { headers: { Authorization: `Bearer ${oauth_token}` } });
    return await res.json();
  }
  async callback(event, auth) {
    const { url } = event;
    const oauthToken = url.searchParams.get("oauth_token");
    const oauthVerifier = url.searchParams.get("oauth_verifier");
    const redirect = this.getStateValue(url.searchParams, "redirect");
    const tokens = await this.getTokens(oauthToken, oauthVerifier);
    let user = await this.getUserProfile(tokens);
    if (this.config.profile) {
      user = await this.config.profile(user, tokens);
    }
    return [user, redirect ?? this.getUri(auth, "/", url.host)];
  }
}

export { TwitterAuthProvider };
//# sourceMappingURL=twitter.esm.js.map
