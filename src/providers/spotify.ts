import { OAuth2Provider, OAuth2ProviderConfig } from "./oauth2";

export interface SpotifyProfile {
  display_name: string;
  email: string;
  external_urls: SpotifyProfileExternalUrls;
  followers: SpotifyProfileFollowers;
  href: string;
  id: string;
  images: SpotifyProfileImage[];
  type: string;
  uri: string;
  // This field is only available when the current user has granted access to the user-read-private scope.
  explicit_content?: SpotifyExplicitContent;
  // This field is only available when the current user has granted access to the user-read-private scope.
  product?: string;
  // This field is only available when the current user has granted access to the user-read-private scope.
  country?: string;
}

export interface SpotifyExplicitContent {
  filter_enabled: boolean;
  filter_locked: boolean;
}

export interface SpotifyProfileImage {
  height: number;
  url: string;
  width: string;
}

export interface SpotifyProfileFollowers {
  href: string;
  total: number;
}

export interface SpotifyProfileExternalUrls {
  spotify: string;
}

export interface SpotifyTokens {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

interface SpotifyOAuth2ProviderConfig extends OAuth2ProviderConfig<SpotifyProfile, SpotifyTokens> {
  show_dialog: boolean;
}

const defaultConfig: Partial<SpotifyOAuth2ProviderConfig> = {
  id: "spotify",
  scope: "user-read-email",
  accessTokenUrl: "https://accounts.spotify.com/api/token",
  authorizationUrl: "https://accounts.spotify.com/authorize",
  profileUrl: "https://api.spotify.com/v1/me",
  contentType: "application/x-www-form-urlencoded",
};

export class SpotifyOAuth2Provider extends OAuth2Provider<
  SpotifyProfile,
  SpotifyTokens,
  SpotifyOAuth2ProviderConfig
> {
  constructor(config: SpotifyOAuth2ProviderConfig) {
    super({
      ...defaultConfig,
      ...config,
    });
  }
}
