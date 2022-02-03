import { RequestEvent } from "@sveltejs/kit/types/hooks";
import type { Auth } from "../auth";
import { OAuth2BaseProvider, OAuth2BaseProviderConfig } from "./oauth2.base";
interface TwitterAuthProviderConfig extends OAuth2BaseProviderConfig {
    apiKey: string;
    apiSecret: string;
}
export declare class TwitterAuthProvider extends OAuth2BaseProvider<any, any, TwitterAuthProviderConfig> {
    constructor(config: TwitterAuthProviderConfig);
    getRequestToken(auth: Auth, host?: string): Promise<{
        oauthToken: any;
        oauthTokenSecret: any;
        oauthCallbackConfirmed: any;
    }>;
    getAuthorizationUrl({ url }: RequestEvent, auth: Auth, state: string, nonce: string): Promise<string>;
    getTokens(oauthToken: string, oauthVerifier: string): Promise<any>;
    getUserProfile({ oauth_token, oauth_token_secret: _ }: any): Promise<any>;
    callback(event: RequestEvent, auth: Auth): Promise<any>;
}
export {};
