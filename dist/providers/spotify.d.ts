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
    explicit_content?: SpotifyExplicitContent;
    product?: string;
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
export declare class SpotifyOAuth2Provider extends OAuth2Provider<SpotifyProfile, SpotifyTokens, SpotifyOAuth2ProviderConfig> {
    constructor(config: SpotifyOAuth2ProviderConfig);
}
export {};
