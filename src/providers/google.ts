import { OAuth2Provider, OAuth2ProviderConfig } from "./oauth2";

interface GoogleOAuth2ProviderConfig extends OAuth2ProviderConfig {}

const defaultConfig: Partial<GoogleOAuth2ProviderConfig> = {
  id: "google",
  scope: ["openid", "profile", "email"],
  accessTokenUrl: "https://accounts.google.com/o/oauth2/token",
  authorizationUrl: "https://accounts.google.com/o/oauth2/auth?response_type=code",
  profileUrl: "https://openidconnect.googleapis.com/v1/userinfo",
};

export class GoogleOAuth2Provider extends OAuth2Provider<GoogleOAuth2ProviderConfig> {
  constructor(config: GoogleOAuth2ProviderConfig) {
    super({
      ...defaultConfig,
      ...config,
    });
  }

  /* getAuthorizationUrl({ host }: ServerRequest, auth: Auth, state: string) {
    const data = {
      response_type: "code",
      client_id: this.config.clientId,
      scope: Array.isArray(this.config.scope) ? this.config.scope.join(" ") : this.config.scope,
      redirect_uri: this.getCallbackUri(auth, host),
      state,
    };

    const url = `${this.config.authorizationUrl!}?${new URLSearchParams(data)}`;
    return url;
  } */

  /* async getTokens(code: string, redirectUri: string) {
    const data = {
      code,
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    };

    const res = await fetch(this.config.accessTokenUrl!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await res.json();
  } */
}
