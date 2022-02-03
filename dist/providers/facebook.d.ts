import { OAuth2Provider, OAuth2ProviderConfig } from "./oauth2";
export interface FacebookProfile {
    id: string;
    name: string;
    first_name: string;
    last_name: string;
    name_format: string;
    picture: {
        data: {
            height: number;
            is_silhouette: boolean;
            url: string;
            width: number;
        };
    };
    short_name: string;
    email: string;
}
export interface FacebookTokens {
    access_token: string;
    token_type: string;
    expires_in: number;
}
interface FacebookOAuth2ProviderConfig<ProfileType = FacebookProfile> extends OAuth2ProviderConfig<ProfileType, FacebookTokens> {
    userProfileFields?: string | (keyof ProfileType)[] | (string | number | symbol)[];
}
export declare class FacebookOAuth2Provider<ProfileType = FacebookProfile> extends OAuth2Provider<ProfileType, FacebookTokens, FacebookOAuth2ProviderConfig<ProfileType>> {
    constructor(config: FacebookOAuth2ProviderConfig<ProfileType>);
}
export {};
