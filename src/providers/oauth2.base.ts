import type { EndpointOutput } from "@sveltejs/kit/types/endpoint";
import { RequestEvent } from "@sveltejs/kit/types/hooks";
import { base64Encode, base64Decode } from "../helpers";
import type { Auth } from "../auth";
import type { CallbackResult } from "../types";
import { Provider, ProviderConfig } from "./base";

export interface OAuth2Tokens {
  access_token: string;
  token_type: string;
}

export type ProfileCallback<ProfileType = any, TokensType = any, ReturnType = any> = (
  profile: ProfileType,
  tokens: TokensType,
) => ReturnType | Promise<ReturnType>;

export interface OAuth2BaseProviderConfig<ProfileType = any, TokensType = any>
  extends ProviderConfig {
  profile?: ProfileCallback<ProfileType, TokensType>;
}

export abstract class OAuth2BaseProvider<
  ProfileType,
  TokensType extends OAuth2Tokens,
  T extends OAuth2BaseProviderConfig,
> extends Provider<T> {
  abstract getAuthorizationUrl(
    event: RequestEvent,
    auth: Auth,
    state: string,
    nonce: string,
  ): string | Promise<string>;
  abstract getTokens(code: string, redirectUri: string): TokensType | Promise<TokensType>;
  abstract getUserProfile(tokens: any): ProfileType | Promise<ProfileType>;

  async signin(event: RequestEvent, auth: Auth): Promise<EndpointOutput> {
    const { method } = event.request;
    const { url } = event;
    const state = [
      `redirect=${url.searchParams.get("redirect") ?? this.getUri(auth, "/", url.host)}`,
    ].join(",");
    const base64State = base64Encode(state);
    const nonce = Math.round(Math.random() * 1000).toString(); // TODO: Generate random based on user values
    const authUrl = await this.getAuthorizationUrl(event, auth, base64State, nonce);

    if (method === "POST") {
      return {
        body: {
          redirect: authUrl,
        },
      };
    }

    return {
      status: 302,
      headers: {
        Location: authUrl,
      },
    };
  }

  getStateValue(query: URLSearchParams, name: string) {
    if (query.get("state")) {
      const state = base64Decode(query.get("state")!);
      return state
        .split(",")
        .find((state) => state.startsWith(`${name}=`))
        ?.replace(`${name}=`, "");
    }
  }

  async callback(event: RequestEvent, auth: Auth): Promise<any> {
    const { request, url } = event;
    const code = url.searchParams.get("code");
    const redirect = this.getStateValue(url.searchParams, "redirect");

    const tokens = await this.getTokens(code!, this.getCallbackUri(auth, url.host));
    let user = await this.getUserProfile(tokens);

    if (this.config.profile) {
      user = await this.config.profile(user, tokens);
    }

    return [user, redirect ?? this.getUri(auth, "/", url.host)];
  }
}
