import { OAuth2Provider, OAuth2ProviderConfig } from "./oauth2";

export interface GitHubProfile {
  id: number;
  login: string;
  avatar_url: string;
  url: string;
  name: string;
  // complete with more info
}

export interface GitHubTokens {
  access_token: string;
  token_type: string;
  expires_in: number;
}

type GitHubOAuth2ProviderConfig = OAuth2ProviderConfig<GitHubProfile, GitHubTokens>;

const defaultConfig: Partial<GitHubOAuth2ProviderConfig> = {
  id: "github",
  scope: "user",
  accessTokenUrl: "https://github.com/login/oauth/access_token",
  authorizationUrl: "https://github.com/login/oauth/authorize",
  profileUrl: "https://api.github.com/user",
  headers: {
    Accept: "application/json",
  },
};

export class GitHubOAuth2Provider extends OAuth2Provider<
  GitHubProfile,
  GitHubTokens,
  GitHubOAuth2ProviderConfig
> {
  constructor(config: GitHubOAuth2ProviderConfig) {
    super({
      ...defaultConfig,
      ...config,
    });
  }

  async getUserProfile(tokens: GitHubTokens): Promise<GitHubProfile> {
    const tokenType = "token"; // 🤷‍♂️ token type returned is "bearer" but GitHub uses "token" keyword
    const res = await fetch(this.config.profileUrl!, {
      headers: { Authorization: `${tokenType} ${tokens.access_token}` },
    });
    return await res.json();
  }
}
