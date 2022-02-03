import { OAuth2Provider } from './oauth2.esm.js';
import '../helpers.esm.js';
import './oauth2.base.esm.js';
import './base.esm.js';

const defaultConfig = {
  id: "spotify",
  scope: "user-read-email",
  accessTokenUrl: "https://accounts.spotify.com/api/token",
  authorizationUrl: "https://accounts.spotify.com/authorize",
  profileUrl: "https://api.spotify.com/v1/me",
  contentType: "application/x-www-form-urlencoded"
};
class SpotifyOAuth2Provider extends OAuth2Provider {
  constructor(config) {
    super({
      ...defaultConfig,
      ...config
    });
  }
}

export { SpotifyOAuth2Provider };
//# sourceMappingURL=spotify.esm.js.map
