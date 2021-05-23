import type { ServerRequest } from "@sveltejs/kit/types/endpoint";
import type { Auth } from "../auth";
import { OAuth2BaseProvider, OAuth2BaseProviderConfig } from "./oauth2.base";

export interface OAuth2ProviderConfig extends OAuth2BaseProviderConfig {
  accessTokenUrl?: string;
  authorizationUrl?: string;
  profileUrl?: string;
  clientId?: string;
  clientSecret?: string;
  scope: string | string[];
  headers?: any;
  authorizationParams?: any;
  params: any;
  grantType?: string;
  responseType?: string;
}

const defaultConfig: Partial<OAuth2ProviderConfig> = {
  responseType: "code",
  grantType: "authorization_code",
};

export class OAuth2Provider<
  T extends OAuth2ProviderConfig = OAuth2ProviderConfig,
> extends OAuth2BaseProvider<T> {
  constructor(config: T) {
    super({
      ...defaultConfig,
      ...config,
    });
  }

  getAuthorizationUrl({ host }: ServerRequest, auth: Auth, state: string) {
    const data = {
      state,
      response_type: this.config.responseType,
      client_id: this.config.clientId,
      scope: Array.isArray(this.config.scope) ? this.config.scope.join(" ") : this.config.scope,
      redirect_uri: this.getCallbackUri(auth, host),
      nonce: Math.round(Math.random() * 1000).toString(), // TODO: Generate random based on user values
      ...(this.config.authorizationParams ?? {}),
    };

    const url = `${this.config.authorizationUrl}?${new URLSearchParams(data)}`;
    return url;
  }

  async getTokens(code: string, redirectUri: string) {
    const data = {
      code,
      grant_type: this.config.grantType,
      client_id: this.config.clientId,
      redirect_uri: redirectUri,
      client_secret: this.config.clientSecret,
      ...(this.config.params ?? {}),
    };

    const res = await fetch(`${this.config.accessTokenUrl}?${new URLSearchParams(data)}`);
    return await res.json();
  }

  async getUserProfile(tokens: any) {
    const res = await fetch(this.config.profileUrl!, {
      headers: { Authorization: `${tokens.token_type} ${tokens.access_token}` },
    });
    return await res.json();
  }
}
