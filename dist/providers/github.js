'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var providers_oauth2 = require('./oauth2.js');
require('../helpers.js');
require('./oauth2.base.js');
require('./base.js');

const defaultConfig = {
  id: "github",
  scope: "user",
  accessTokenUrl: "https://github.com/login/oauth/access_token",
  authorizationUrl: "https://github.com/login/oauth/authorize",
  profileUrl: "https://api.github.com/user",
  headers: {
    Accept: "application/json"
  }
};
class GitHubOAuth2Provider extends providers_oauth2.OAuth2Provider {
  constructor(config) {
    super({
      ...defaultConfig,
      ...config
    });
  }
  async getUserProfile(tokens) {
    const tokenType = "token";
    const res = await fetch(this.config.profileUrl, {
      headers: { Authorization: `${tokenType} ${tokens.access_token}` }
    });
    return await res.json();
  }
}

exports.GitHubOAuth2Provider = GitHubOAuth2Provider;
//# sourceMappingURL=github.js.map
