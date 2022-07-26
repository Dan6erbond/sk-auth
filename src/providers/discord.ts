import { OAuth2Provider, OAuth2ProviderConfig } from "./oauth2";

export interface DiscordProfile {
  id: string;
  username: string;
  discriminator: string;
  avatar?: string;
  bot: boolean;
  system: boolean;
  mfa_enabled: boolean;
  banner?: string;
  accent_color?: number;
  locale: string;
  flags: number;
  premium_type: number;
  public_flags: number;
}

export interface DiscordTokens {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

type DiscordOAuth2ProviderConfig = OAuth2ProviderConfig<DiscordProfile, DiscordTokens>;

const defaultConfig: Partial<DiscordOAuth2ProviderConfig> = {
  id: "discord",
  scope: "identify",
  accessTokenUrl: "https://discord.com/api/oauth2/token",
  authorizationUrl: "https://discord.com/api/oauth2/authorize",
  profileUrl: "https://discord.com/api/users/@me",
  contentType: "application/json"
};

export class DiscordOAuth2Provider extends OAuth2Provider<
  DiscordProfile,
  DiscordTokens,
  DiscordOAuth2ProviderConfig
> {
  constructor(config: DiscordOAuth2ProviderConfig) {
    super({
      ...defaultConfig,
      ...config,
    });
  }

  async getUserProfile(tokens: DiscordTokens): Promise<DiscordProfile> {
    const res = await fetch(this.config.profileUrl!, {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    return await res.json();
  }
}
