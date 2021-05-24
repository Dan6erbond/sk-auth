import type { EndpointOutput, ServerRequest } from "@sveltejs/kit/types/endpoint";
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
    request: ServerRequest,
    auth: Auth,
    state: string,
    nonce: string,
  ): string | Promise<string>;
  abstract getTokens(code: string, redirectUri: string): TokensType | Promise<TokensType>;
  abstract getUserProfile(tokens: any): ProfileType | Promise<ProfileType>;

  async signin(request: ServerRequest, auth: Auth): Promise<EndpointOutput> {
    const { method, host, query } = request;
    const state = [`redirect=${query.get("redirect") ?? this.getUri(auth, "/", host)}`].join(",");
    const base64State = Buffer.from(state).toString("base64");
    const nonce = Math.round(Math.random() * 1000).toString(); // TODO: Generate random based on user values
    const url = await this.getAuthorizationUrl(request, auth, base64State, nonce);

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

  async callback({ query, host }: ServerRequest, auth: Auth): Promise<CallbackResult> {
    const code = query.get("code");
    const redirect = this.getStateValue(query, "redirect");

    const tokens = await this.getTokens(code!, this.getCallbackUri(auth, host));
    let user = await this.getUserProfile(tokens);

    if (this.config.profile) {
      user = await this.config.profile(user, tokens);
    }

    return [user, redirect ?? this.getUri(auth, "/", host)];
  }
}
