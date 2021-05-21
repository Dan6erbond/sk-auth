import type { EndpointOutput } from "@sveltejs/kit";
import type { ServerRequest } from "@sveltejs/kit/types/endpoint";
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

  getUri(host: string, path: string) {
    return `http://${host}${path}`;
  }

  getCallbackUri(host: string) {
    return this.getUri(host, `${"/api/auth/callback/"}${this.id}`);
  }

  abstract signin<Locals extends Record<string, any> = Record<string, any>, Body = unknown>(
    request: ServerRequest<Locals, Body>,
  ): EndpointOutput | Promise<EndpointOutput>;

  abstract callback<Locals extends Record<string, any> = Record<string, any>, Body = unknown>(
    request: ServerRequest<Locals, Body>,
  ): CallbackResult | Promise<CallbackResult>;
}
