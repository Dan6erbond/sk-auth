import { OAuth2Provider, OAuth2ProviderConfig } from "./oauth2";
export interface GitHubProfile {
    id: number;
    login: string;
    avatar_url: string;
    url: string;
    name: string;
}
export interface GitHubTokens {
    access_token: string;
    token_type: string;
    expires_in: number;
}
declare type GitHubOAuth2ProviderConfig = OAuth2ProviderConfig<GitHubProfile, GitHubTokens>;
export declare class GitHubOAuth2Provider extends OAuth2Provider<GitHubProfile, GitHubTokens, GitHubOAuth2ProviderConfig> {
    constructor(config: GitHubOAuth2ProviderConfig);
    getUserProfile(tokens: GitHubTokens): Promise<GitHubProfile>;
}
export {};
