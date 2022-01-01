import type { EndpointOutput } from "@sveltejs/kit";
import { ServerRequest } from '@sveltejs/kit/types/hooks';
import type { Auth } from "../auth";
import type { CallbackResult } from "../types";

export interface ProviderConfig {
  id?: string;
  profile?: (profile: any, account: any) => any | Promise<any>;
}

export abstract class Provider<T extends ProviderConfig = ProviderConfig> {
  id: string;

  constructor(protected readonly config: T) {
    this.id = config.id!;
  }

  getUri(svelteKitAuth: Auth, path: string, host?: string) {
    return svelteKitAuth.getUrl(path, host);
  }

  getCallbackUri(svelteKitAuth: Auth, host?: string) {
    return this.getUri(svelteKitAuth, `${"/callback/"}${this.id}`, host);
  }

  getSigninUri(svelteKitAuth: Auth, host?: string) {
    return this.getUri(svelteKitAuth, `${"/signin/"}${this.id}`, host);
  }

  abstract signin<Locals extends Record<string, any> = Record<string, any>, Body = unknown>(
    request: ServerRequest<Locals, Body>,
    svelteKitAuth: Auth,
  ): EndpointOutput | Promise<EndpointOutput>;

  abstract callback<Locals extends Record<string, any> = Record<string, any>, Body = unknown>(
    request: ServerRequest<Locals, Body>,
    svelteKitAuth: Auth,
  ): CallbackResult | Promise<CallbackResult>;
}
