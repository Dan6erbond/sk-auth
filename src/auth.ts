import type { GetSession, RequestHandler } from "@sveltejs/kit";
import type { EndpointOutput, ServerRequest } from "@sveltejs/kit/types/endpoint";
import type { Headers } from "@sveltejs/kit/types/helper";
import cookie from "cookie";
import * as jsonwebtoken from "jsonwebtoken";
import type { JWT, Session } from "./interfaces";
import { join } from "./path";
import type { Provider } from "./providers";

interface AuthConfig {
  providers: Provider[];
  callbacks?: AuthCallbacks;
  jwtSecret?: string;
  jwtExpiresIn?: string | number;
  host?: string;
  basePath?: string;
}

interface AuthCallbacks {
  signIn?: () => boolean | Promise<boolean>;
  jwt?: (token: JWT, profile?: any) => JWT | Promise<JWT>;
  session?: (token: JWT, session: Session) => Session | Promise<Session>;
  redirect?: (url: string) => string | Promise<string>;
}

export class Auth {
  constructor(private readonly config?: AuthConfig) {}

  get basePath() {
    return this.config?.basePath ?? "/api/auth";
  }

  getJwtSecret() {
    if (this.config?.jwtSecret) {
      return this.config?.jwtSecret;
    }

    if (this.config?.providers?.length) {
      const provs = this.config?.providers?.map((provider) => provider.id).join("+");
      return Buffer.from(provs).toString("base64");
    }

    return "svelte_auth_secret";
  }

  async getToken(headers: Headers) {
    if (!headers.cookie) {
      return null;
    }

    const cookies = cookie.parse(headers.cookie);

    if (!cookies.svelteauthjwt) {
      return null;
    }

    let token: JWT;
    try {
      token = (jsonwebtoken.verify(cookies.svelteauthjwt, this.getJwtSecret()) || {}) as JWT;
    } catch {
      return null;
    }

    if (this.config?.callbacks?.jwt) {
      token = await this.config.callbacks.jwt(token);
    }

    return token;
  }

  getBaseUrl(host?: string) {
    return this.config?.host ?? `http://${host}`;
  }

  getPath(path: string) {
    const pathname = join([this.basePath, path]);
    return pathname;
  }

  getUrl(path: string, host?: string) {
    const pathname = this.getPath(path);
    return new URL(pathname, this.getBaseUrl(host)).href;
  }

  setToken(headers: Headers, newToken: JWT | any) {
    const originalToken = this.getToken(headers);

    return {
      ...(originalToken ?? {}),
      ...newToken,
    };
  }

  signToken(token: JWT) {
    const opts = !token.exp
      ? {
          expiresIn: this.config?.jwtExpiresIn ?? "30d",
        }
      : {};
    const jwt = jsonwebtoken.sign(token, this.getJwtSecret(), opts);
    return jwt;
  }

  async getRedirectUrl(host: string, redirectUrl?: string) {
    let redirect = redirectUrl || this.getBaseUrl(host);
    if (this.config?.callbacks?.redirect) {
      redirect = await this.config.callbacks.redirect(redirect);
    }
    return redirect;
  }

  async handleProviderCallback(
    request: ServerRequest,
    provider: Provider,
  ): Promise<EndpointOutput> {
    const { headers, host } = request;
    const [profile, redirectUrl] = await provider.callback(request, this);

    let token = (await this.getToken(headers)) ?? { user: {} };
    if (this.config?.callbacks?.jwt) {
      token = await this.config.callbacks.jwt(token, profile);
    } else {
      token = this.setToken(headers, { user: profile });
    }

    const jwt = this.signToken(token);
    const redirect = await this.getRedirectUrl(host, redirectUrl ?? undefined);

    return {
      status: 302,
      headers: {
        "set-cookie": `svelteauthjwt=${jwt}; Path=/; HttpOnly`,
        Location: redirect,
      },
    };
  }

  async handleEndpoint(request: ServerRequest): Promise<EndpointOutput> {
    const { path, headers, method, host } = request;

    if (path === this.getPath("signout")) {
      const token = this.setToken(headers, {});
      const jwt = this.signToken(token);

      if (method === "POST") {
        return {
          headers: {
            "set-cookie": `svelteauthjwt=${jwt}; Path=/; HttpOnly`,
          },
          body: {
            signout: true,
          },
        };
      }

      const redirect = await this.getRedirectUrl(host);

      return {
        status: 302,
        headers: {
          "set-cookie": `svelteauthjwt=${jwt}; Path=/; HttpOnly`,
          Location: redirect,
        },
      };
    }

    const match = path.match(/\/api\/auth\/(?<method>signin|callback)\/(?<provider>\w+)/);

    if (match && match.groups) {
      const provider = this.config?.providers?.find(
        (provider) => provider.id === match.groups!.provider,
      );
      if (provider) {
        if (match.groups.method === "signin") {
          return await provider.signin(request, this);
        } else {
          return await this.handleProviderCallback(request, provider);
        }
      }
    }

    return {
      status: 404,
      body: "Not found.",
    };
  }

  get: RequestHandler = async (request) => {
    const { path } = request;

    if (path === this.getPath("csrf")) {
      return { body: "1234" }; // TODO: Generate real token
    } else if (path === this.getPath("session")) {
      const session = await this.getSession(request);
      return {
        body: {
          session,
        },
      };
    }

    return await this.handleEndpoint(request);
  };

  post: RequestHandler = async (request) => {
    return await this.handleEndpoint(request);
  };

  getSession: GetSession = async ({ headers }) => {
    const token = await this.getToken(headers);

    if (token) {
      if (this.config?.callbacks?.session) {
        return await this.config.callbacks.session(token, { user: token.user });
      }

      return { user: token.user };
    }

    return {};
  };
}
