'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var providers_oauth2 = require('./oauth2.js');
require('../helpers.js');
require('./oauth2.base.js');
require('./base.js');

const defaultConfig = {
  id: "spotify",
  scope: "user-read-email",
  accessTokenUrl: "https://accounts.spotify.com/api/token",
  authorizationUrl: "https://accounts.spotify.com/authorize",
  profileUrl: "https://api.spotify.com/v1/me",
  contentType: "application/x-www-form-urlencoded"
};
class SpotifyOAuth2Provider extends providers_oauth2.OAuth2Provider {
  constructor(config) {
    super({
      ...defaultConfig,
      ...config
    });
  }
}

exports.SpotifyOAuth2Provider = SpotifyOAuth2Provider;
//# sourceMappingURL=spotify.js.map
