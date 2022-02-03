import { OAuth2Provider } from './oauth2.esm.js';
import '../helpers.esm.js';
import './oauth2.base.esm.js';
import './base.esm.js';

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
class GitHubOAuth2Provider extends OAuth2Provider {
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

export { GitHubOAuth2Provider };
//# sourceMappingURL=github.esm.js.map
