import { OAuth2Provider, OAuth2ProviderConfig } from "./oauth2";

interface FacebookOAuth2ProviderConfig extends OAuth2ProviderConfig {
  userProfileFields?: string | string[];
}

const defaultConfig: Partial<FacebookOAuth2ProviderConfig> = {
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
    "email",
  ],
  profileUrl: "https://graph.facebook.com/me",
};

export class FacebookOAuth2Provider extends OAuth2Provider<FacebookOAuth2ProviderConfig> {
  constructor(config: FacebookOAuth2ProviderConfig) {
    const userProfileFields = config.userProfileFields || defaultConfig.userProfileFields;
    const profileUrl = `${config.profileUrl || defaultConfig.profileUrl}?${
      Array.isArray(userProfileFields) ? userProfileFields.join(",") : userProfileFields
    }`;

    super({
      ...defaultConfig,
      profileUrl,
      ...config,
    });
  }
}
