import { OAuth2Provider, OAuth2ProviderConfig } from "./oauth2";
export interface GoogleProfile {
    sub: string;
    name: string;
    give_name: string;
    picture: string;
    email: string;
    email_verified: boolean;
    locale: string;
}
export interface GoogleTokens {
    access_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
    id_token: string;
}
declare type GoogleOAuth2ProviderConfig = OAuth2ProviderConfig<GoogleProfile, GoogleTokens>;
export declare class GoogleOAuth2Provider extends OAuth2Provider<GoogleProfile, GoogleTokens, GoogleOAuth2ProviderConfig> {
    constructor(config: GoogleOAuth2ProviderConfig);
}
export {};
