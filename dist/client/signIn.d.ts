import type { ClientRequestConfig } from "./types";
interface SignInConfig extends ClientRequestConfig {
    redirectUrl?: string;
}
export declare function signIn(provider: string, data?: any, config?: SignInConfig): Promise<any>;
export {};
