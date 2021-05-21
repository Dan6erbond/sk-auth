import type { ServerRequest } from "@sveltejs/kit/types/endpoint";
import { OAuth2Provider, OAuth2ProviderConfig } from "./oauth2";

interface RedditOAuthProviderConfig extends OAuth2ProviderConfig {
  apiKey: string;
  apiSecret: string;
  scope?: string;
  duration?: "temporary" | "permanent";
}

const redditProfileHandler = ({
  is_employee,
  has_external_account,
  snoovatar_img,
  verified,
  id,
  over_18,
  is_gold,
  is_mod,
  awarder_karma,
  has_verified_email,
  is_suspended,
  icon_img,
  pref_nightmode,
  awardee_karma,
  password_set,
  link_karma,
  total_karma,
  name,
  created,
  created_utc,
  comment_karma,
}) => ({
  is_employee,
  has_external_account,
  snoovatar_img,
  verified,
  id,
  over_18,
  is_gold,
  is_mod,
  awarder_karma,
  has_verified_email,
  is_suspended,
  icon_img,
  pref_nightmode,
  awardee_karma,
  password_set,
  link_karma,
  total_karma,
  name,
  created,
  created_utc,
  comment_karma,
});

const defaultConfig: Partial<RedditOAuthProviderConfig> = {
  id: "reddit",
  scope: "identity",
  duration: "temporary",
  profile: redditProfileHandler,
};

export class RedditOAuthProvider extends OAuth2Provider<RedditOAuthProviderConfig> {
  constructor(config: RedditOAuthProviderConfig) {
    super({
      ...defaultConfig,
      ...config,
    });
  }

  static profileHandler = redditProfileHandler;

  async getSigninUrl({ host }: ServerRequest, state: string) {
    const endpoint = "https://www.reddit.com/api/v1/authorize";

    const data = {
      client_id: this.config.apiKey,
      response_type: "code",
      state,
      redirect_uri: this.getCallbackUri(host),
      duration: this.config.duration,
      scope: this.config.scope,
    };

    const url = `${endpoint}?${new URLSearchParams(data)}`;
    return url;
  }

  async getTokens(code: string, redirectUri: string) {
    const endpoint = "https://www.reddit.com/api/v1/access_token";

    const data = {
      code,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    };
    const body = Object.entries(data)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join("&");

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(`${this.config.apiKey}:${this.config.apiSecret}`).toString("base64"),
      },
      body,
    });

    return await res.json();
  }

  async getUserProfile(tokens: any) {
    const endpoint = "https://oauth.reddit.com/api/v1/me";
    const res = await fetch(endpoint, {
      headers: { Authorization: `${tokens.token_type} ${tokens.access_token}` },
    });
    return await res.json();
  }
}
