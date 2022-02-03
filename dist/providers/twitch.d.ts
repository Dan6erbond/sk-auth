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
declare type TwitchOAuth2ProviderConfig = OAuth2ProviderConfig<TwitchProfile, TwitchTokens>;
export declare class TwitchOAuth2Provider extends OAuth2Provider<TwitchProfile, TwitchTokens, TwitchOAuth2ProviderConfig> {
    constructor(config: TwitchOAuth2ProviderConfig);
    getUserProfile(tokens: TwitchTokens): Promise<TwitchProfile>;
}
export {};
