import { OAuth2Provider, OAuth2ProviderConfig } from "./oauth2";

const defaultConfig: Partial<OAuth2ProviderConfig> = {
  id: "google",
  scope: ["openid", "profile", "email"],
  accessTokenUrl: "https://accounts.google.com/o/oauth2/token",
  authorizationUrl: "https://accounts.google.com/o/oauth2/auth?response_type=code",
  profileUrl: "https://openidconnect.googleapis.com/v1/userinfo",
};

export class GoogleOAuth2Provider extends OAuth2Provider {
  constructor(config: OAuth2ProviderConfig) {
    super({
      ...defaultConfig,
      ...config,
    });
  }
}
