import { OAuth2Provider, OAuth2ProviderConfig } from "./oauth2";

export interface TwitchProfile {
  id: string;
  login: string;
  display_name: string;
  type?: string;
  broadcaster_type?: string;
  description: boolean;
  profile_image_url: string;
  offline_image_url: string;
  view_count: number;
  email: string;
  created_at: string;
}

export interface TwitchTokens {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  refresh_token: string;
}

type TwitchOAuth2ProviderConfig = OAuth2ProviderConfig<TwitchProfile, TwitchTokens>;

const defaultConfig: Partial<TwitchOAuth2ProviderConfig> = {
  id: "twitch",
  scope: "user:read:email",
  accessTokenUrl: "https://id.twitch.tv/oauth2/token",
  authorizationUrl: "https://id.twitch.tv/oauth2/authorize",
  profileUrl: "https://api.twitch.tv/helix/users",
};

export class TwitchOAuth2Provider extends OAuth2Provider<
  TwitchProfile,
  TwitchTokens,
  TwitchOAuth2ProviderConfig
> {
  constructor(config: TwitchOAuth2ProviderConfig) {
    super({
      ...defaultConfig,
      ...config,
    });
  }

  async getUserProfile(tokens: TwitchTokens): Promise<TwitchProfile> {
    const headers = {
      "Client-ID": this.config.clientId + "",
      Accept: "application/vnd.twitchtv.v5+json",
      Authorization: `Bearer ${tokens.access_token}`,
    };
    const {
      data: [profile],
    } = await fetch(this.config.profileUrl!, { headers: headers }).then((res) => res.json());
    return profile;
  }
}
