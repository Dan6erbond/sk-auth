import type { EndpointOutput } from "@sveltejs/kit";
import { RequestEvent } from "@sveltejs/kit/types/hooks";
import type { Auth } from "../auth";
import type { CallbackResult } from "../types";
export interface ProviderConfig {
    id?: string;
    profile?: (profile: any, account: any) => any | Promise<any>;
}
export declare abstract class Provider<T extends ProviderConfig = ProviderConfig> {
    protected readonly config: T;
    id: string;
    constructor(config: T);
    getUri(svelteKitAuth: Auth, path: string, host?: string): string;
    getCallbackUri(svelteKitAuth: Auth, host?: string): string;
    getSigninUri(svelteKitAuth: Auth, host?: string): string;
    abstract signin<Locals extends Record<string, any> = Record<string, any>, Body = unknown>(event: RequestEvent, svelteKitAuth: Auth): EndpointOutput | Promise<EndpointOutput>;
    abstract callback<Locals extends Record<string, any> = Record<string, any>, Body = unknown>(event: RequestEvent, svelteKitAuth: Auth): CallbackResult | Promise<CallbackResult>;
}
