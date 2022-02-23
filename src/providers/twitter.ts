import { RequestEvent } from "@sveltejs/kit/types/hooks";
import type { Auth } from "../auth";
import { OAuth2BaseProvider, OAuth2BaseProviderConfig } from "./oauth2.base";

interface TwitterAuthProviderConfig extends OAuth2BaseProviderConfig {
  apiKey: string;
  apiSecret: string;
}

const defaultConfig: Partial<TwitterAuthProviderConfig> = {
  id: "twitter",
};

export class TwitterAuthProvider extends OAuth2BaseProvider<any, any, TwitterAuthProviderConfig> {
  constructor(config: TwitterAuthProviderConfig) {
    super({
      ...defaultConfig,
      ...config,
    });
  }

  async getRequestToken(auth: Auth, host?: string) {
    const endpoint = "https://api.twitter.com/oauth/request_token";

    const data = {
      oauth_callback: encodeURIComponent(this.getCallbackUri(auth, host)),
      oauth_consumer_key: this.config.apiKey,
    };

    const res = await fetch(`${endpoint}?${new URLSearchParams(data)}`, { method: "POST" });
    const { oauth_token, oauth_token_secret, oauth_callback_confirmed } = await res.json();

    return {
      oauthToken: oauth_token,
      oauthTokenSecret: oauth_token_secret,
      oauthCallbackConfirmed: oauth_callback_confirmed,
    };
  }

  async getAuthorizationUrl({ url }: RequestEvent, auth: Auth, state: string, nonce: string) {
    const endpoint = "https://api.twitter.com/oauth/authorize";

    const { oauthToken } = await this.getRequestToken(auth, url.host);

    const data = {
      oauth_token: oauthToken,
    };

    const authUrl = `${endpoint}?${new URLSearchParams(data)}`;
    return authUrl;
  }

  async getTokens(oauthToken: string, oauthVerifier: string) {
    const endpoint = "https://api.twitter.com/oauth/access_token";

    const data = {
      oauth_consumer_key: this.config.apiKey,
      oauth_token: oauthToken,
      oauth_verifier: oauthVerifier,
    };

    const res = await fetch(`${endpoint}?${new URLSearchParams(data)}`, { method: "POST" });
    return await res.json();
  }

  async getUserProfile({ oauth_token, oauth_token_secret: _ }: any) {
    const endpoint = "https://api.twitter.com/1.1/account/verify_credentials.json";

    const res = await fetch(endpoint, { headers: { Authorization: `Bearer ${oauth_token}` } });
    return await res.json();
  }

  async callback(event: RequestEvent, auth: Auth): Promise<any> {
    const { url } = event;
    const oauthToken = url.searchParams.get("oauth_token");
    const oauthVerifier = url.searchParams.get("oauth_verifier");
    const redirect = this.getStateValue(url.searchParams, "redirect");

    const tokens = await this.getTokens(oauthToken!, oauthVerifier!);
    let user = await this.getUserProfile(tokens);

    if (this.config.profile) {
      user = await this.config.profile(user, tokens);
    }

    return [user, redirect ?? this.getUri(auth, "/", url.host)];
  }
}
