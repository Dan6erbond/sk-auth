import { RequestEvent } from "@sveltejs/kit/types/hooks";
import type { Auth } from "../auth";
import { OAuth2BaseProvider, OAuth2BaseProviderConfig, OAuth2Tokens } from "./oauth2.base";
export interface OAuth2ProviderConfig<ProfileType = any, TokensType extends OAuth2Tokens = any> extends OAuth2BaseProviderConfig<ProfileType, TokensType> {
    accessTokenUrl?: string;
    authorizationUrl?: string;
    profileUrl?: string;
    clientId?: string;
    clientSecret?: string;
    scope?: string | string[];
    headers?: any;
    authorizationParams?: any;
    params?: any;
    grantType?: string;
    responseType?: string;
    contentType?: "application/json" | "application/x-www-form-urlencoded";
}
export declare class OAuth2Provider<ProfileType = any, TokensType extends OAuth2Tokens = OAuth2Tokens, ConfigType extends OAuth2ProviderConfig = OAuth2ProviderConfig<ProfileType, TokensType>> extends OAuth2BaseProvider<ProfileType, TokensType, ConfigType> {
    constructor(config: ConfigType);
    getAuthorizationUrl({ url }: RequestEvent, auth: Auth, state: string, nonce: string): string;
    getTokens(code: string, redirectUri: string): Promise<TokensType>;
    getUserProfile(tokens: TokensType): Promise<ProfileType>;
}
