import type { ServerRequest } from "@sveltejs/kit/types/endpoint";
import { OAuth2Provider, OAuth2ProviderConfig } from "./oauth2";

interface FacebookAuthProviderConfig extends OAuth2ProviderConfig {
  clientId: string;
  clientSecret: string;
  userProfileFields?: string;
  scope?: string;
}

const defaultConfig: Partial<FacebookAuthProviderConfig> = {
  id: "facebook",
  scope: "email public_profile user_link",
  userProfileFields:
    "id,name,first_name,last_name,middle_name,name_format,picture,short_name,email",
};

export class FacebookAuthProvider extends OAuth2Provider<FacebookAuthProviderConfig> {
  constructor(config: FacebookAuthProviderConfig) {
    super({
      ...defaultConfig,
      ...config,
    });
  }

  getSigninUrl({ host }: ServerRequest, state: string) {
    const endpoint = "https://www.facebook.com/v10.0/dialog/oauth";

    const data = {
      client_id: this.config.clientId,
      scope: this.config.scope,
      redirect_uri: this.getCallbackUri(host),
      state,
    };

    const url = `${endpoint}?${new URLSearchParams(data)}`;
    return url;
  }

  async getTokens(code: string, redirectUri: string) {
    const endpoint = "https://graph.facebook.com/v10.0/oauth/access_token";

    const data = {
      code,
      client_id: this.config.clientId,
      redirect_uri: redirectUri,
      client_secret: this.config.clientSecret,
    };

    const res = await fetch(`${endpoint}?${new URLSearchParams(data)}`);
    return await res.json();
  }

  async inspectToken(tokens: any) {
    const endpoint = "https://graph.facebook.com/debug_token";

    const data = {
      input_token: tokens.access_token,
      access_token: `${this.config.clientId}|${this.config.clientSecret}`,
    };

    const res = await fetch(`${endpoint}?${new URLSearchParams(data)}`);
    return await res.json();
  }

  async getUserProfile(tokens: any) {
    const inspectResult = await this.inspectToken(tokens);
    const endpoint = `https://graph.facebook.com/v10.0/${inspectResult.data.user_id}`;

    const data = {
      access_token: tokens.access_token,
      fields: this.config.userProfileFields,
    };

    const res = await fetch(`${endpoint}?${new URLSearchParams(data)}`);
    return await res.json();
  }
}
