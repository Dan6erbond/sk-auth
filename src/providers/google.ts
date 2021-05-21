import type { ServerRequest } from "@sveltejs/kit/types/endpoint";
import { OAuth2Provider, OAuth2ProviderConfig } from "./oauth2";

interface GoogleOAuthProviderConfig extends OAuth2ProviderConfig {
  clientId: string;
  clientSecret: string;
  discoveryDocument?: string;
  scope?: string;
}

const defaultConfig: Partial<GoogleOAuthProviderConfig> = {
  id: "google",
  discoveryDocument: "https://accounts.google.com/.well-known/openid-configuration",
  scope: "openid profile email",
};

export class GoogleOAuthProvider extends OAuth2Provider<GoogleOAuthProviderConfig> {
  constructor(config: GoogleOAuthProviderConfig) {
    super({
      ...defaultConfig,
      ...config,
    });
  }

  async getProviderMetadata() {
    const res = await fetch(this.config.discoveryDocument!);
    const metadata = await res.json();
    return metadata;
  }

  async getEndpoint(key: string) {
    const metadata = await this.getProviderMetadata();
    return metadata[key] as string;
  }

  async getSigninUrl({ host }: ServerRequest, state: string) {
    const authorizationEndpoint = await this.getEndpoint("authorization_endpoint");

    const data = {
      response_type: "code",
      client_id: this.config.clientId,
      scope: this.config.scope!,
      redirect_uri: this.getCallbackUri(host),
      state,
      login_hint: "example@provider.com",
      nonce: Math.round(Math.random() * 1000).toString(), // TODO: Generate random based on user values
    };

    const url = `${authorizationEndpoint}?${new URLSearchParams(data)}`;
    return url;
  }

  async getTokens(code: string, redirectUri: string) {
    const tokenEndpoint = await this.getEndpoint("token_endpoint");

    const data = {
      code,
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    };

    const res = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await res.json();
  }

  async getUserProfile(tokens: any) {
    const userProfileEndpoint = await this.getEndpoint("userinfo_endpoint");
    const res = await fetch(userProfileEndpoint, {
      headers: { Authorization: `${tokens.token_type} ${tokens.access_token}` },
    });
    return await res.json();
  }
}
