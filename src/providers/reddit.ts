import { OAuth2Provider, OAuth2ProviderConfig } from "./oauth2";

interface RedditOAuth2ProviderConfig extends OAuth2ProviderConfig {
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

const defaultConfig: Partial<RedditOAuth2ProviderConfig> = {
  id: "reddit",
  scope: "identity",
  duration: "temporary",
  profile: redditProfileHandler,
  authorizationUrl: "https://www.reddit.com/api/v1/authorize",
  accessTokenUrl: "https://www.reddit.com/api/v1/access_token",
  profileUrl: "https://oauth.reddit.com/api/v1/me",
};

export class RedditOAuth2Provider extends OAuth2Provider<RedditOAuth2ProviderConfig> {
  constructor(config: RedditOAuth2ProviderConfig) {
    super({
      ...defaultConfig,
      ...config,
    });
  }

  static profileHandler = redditProfileHandler;

  async getTokens(code: string, redirectUri: string) {
    const endpoint = this.config.accessTokenUrl!;

    const data = {
      code,
      redirect_uri: redirectUri,
      grant_type: this.config.grantType!,
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
          Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString("base64"),
      },
      body,
    });

    return await res.json();
  }
}
