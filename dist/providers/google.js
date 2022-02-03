'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var providers_oauth2 = require('./oauth2.js');
require('../helpers.js');
require('./oauth2.base.js');
require('./base.js');

const defaultConfig = {
  id: "google",
  scope: ["openid", "profile", "email"],
  accessTokenUrl: "https://accounts.google.com/o/oauth2/token",
  authorizationUrl: "https://accounts.google.com/o/oauth2/auth",
  profileUrl: "https://openidconnect.googleapis.com/v1/userinfo"
};
class GoogleOAuth2Provider extends providers_oauth2.OAuth2Provider {
  constructor(config) {
    super({
      ...defaultConfig,
      ...config
    });
  }
}

exports.GoogleOAuth2Provider = GoogleOAuth2Provider;
//# sourceMappingURL=google.js.map
