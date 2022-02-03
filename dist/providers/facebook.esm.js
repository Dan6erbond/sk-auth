import { OAuth2Provider } from './oauth2.esm.js';
import '../helpers.esm.js';
import './oauth2.base.esm.js';
import './base.esm.js';

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
class FacebookOAuth2Provider extends OAuth2Provider {
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

export { FacebookOAuth2Provider };
//# sourceMappingURL=facebook.esm.js.map
