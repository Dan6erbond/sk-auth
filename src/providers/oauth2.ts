import type { EndpointOutput, ServerRequest } from "@sveltejs/kit/types/endpoint";
import type { CallbackResult } from "../types";
import { Provider, ProviderConfig } from "./base";

export interface OAuth2ProviderConfig extends ProviderConfig {
  profile?: (profile: any, tokens: any) => any | Promise<any>;
}

export abstract class OAuth2Provider<T extends OAuth2ProviderConfig> extends Provider<T> {
  abstract getSigninUrl(request: ServerRequest, state: string): string | Promise<string>;
  abstract getTokens(code: string, redirectUri: string): any | Promise<any>;
  abstract getUserProfile(tokens: any): any | Promise<any>;

  async signin(request: ServerRequest): Promise<EndpointOutput> {
    const { method, host, query } = request;
    const state = [`redirect=${query.get("redirect") ?? this.getUri(host, "/")}`].join(",");
    const base64State = Buffer.from(state).toString("base64");
    const url = await this.getSigninUrl(request, base64State);

    if (method === "POST") {
      return {
        body: {
          redirect: url,
        },
      };
    }

    return {
      status: 302,
      headers: {
        Location: url,
      },
    };
  }

  getStateValue(query: URLSearchParams, name: string) {
    if (query.get("state")) {
      const state = Buffer.from(query.get("state")!, "base64").toString();
      return state
        .split(",")
        .find((state) => state.startsWith(`${name}=`))
        ?.replace(`${name}=`, "");
    }
  }

  async callback({ query, host }: ServerRequest): Promise<CallbackResult> {
    const code = query.get("code");
    const redirect = this.getStateValue(query, "redirect");

    const tokens = await this.getTokens(code!, this.getCallbackUri(host));
    let user = await this.getUserProfile(tokens);

    if (this.config.profile) {
      user = await this.config.profile(user, tokens);
    }

    return [user, redirect ?? this.getUri(host, "/")];
  }
}
