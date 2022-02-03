'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var providers_oauth2 = require('./oauth2.js');
require('../helpers.js');
require('./oauth2.base.js');
require('./base.js');

const defaultConfig = {
  id: "facebook",
  scope: ["email", "public_profile", "user_link"],
  userProfileFields: [
    "id",
    "name",
    "first_name",
    "last_name",
    "middle_name",
    "name_format",
    "picture",
    "short_name",
    "email"
  ],
  profileUrl: "https://graph.facebook.com/me",
  authorizationUrl: "https://www.facebook.com/v10.0/dialog/oauth",
  accessTokenUrl: "https://graph.facebook.com/v10.0/oauth/access_token"
};
class FacebookOAuth2Provider extends providers_oauth2.OAuth2Provider {
  constructor(config) {
    const userProfileFields = config.userProfileFields ?? defaultConfig.userProfileFields;
    const data = {
      fields: Array.isArray(userProfileFields) ? userProfileFields.join(",") : userProfileFields
    };
    const profileUrl = `${config.profileUrl ?? defaultConfig.profileUrl}?${new URLSearchParams(data)}`;
    super({
      ...defaultConfig,
      ...config,
      profileUrl
    });
  }
}

exports.FacebookOAuth2Provider = FacebookOAuth2Provider;
//# sourceMappingURL=facebook.js.map
