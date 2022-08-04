import type { GetSession, RequestHandler } from "@sveltejs/kit";
import type { EndpointOutput } from "@sveltejs/kit/types/endpoint";
import { RequestEvent } from "@sveltejs/kit/types/hooks";
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
  protocol?: string;
  basePath?: string;
  cookieName?: string;
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

  get cookieName() {
    return this.config?.cookieName ?? "svelteauthjwt";
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

  async getToken(headers: any) {
    if (!headers.get("cookie")) {
      return null;
    }

    const cookies = cookie.parse(headers.get("cookie"));

    if (!cookies[this.cookieName]) {
      return null;
    }

    let token: JWT;
    try {
      token = (jsonwebtoken.verify(cookies[this.cookieName], this.getJwtSecret()) || {}) as JWT;
    } catch {
      return null;
    }

    if (this.config?.callbacks?.jwt) {
      token = await this.config.callbacks.jwt(token);
    }

    return token;
  }

  getBaseUrl(host?: string) {
    const protocol = this.config?.protocol ?? "https";
    host = this.config?.host ?? host;
    return `${protocol}://${host}`;
  }

  getPath(path: string) {
    const pathname = join([this.basePath, path]);
    return pathname;
  }

  getUrl(path: string, host?: string) {
    const pathname = this.getPath(path);
    return new URL(pathname, this.getBaseUrl(host)).href;
  }

  setToken(headers: any, newToken: JWT | any) {
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

  async handleProviderCallback(event: RequestEvent, provider: Provider): Promise<EndpointOutput> {
    const { headers } = event.request;
    const { url } = event;
    const [profile, redirectUrl] = await provider.callback(event, this);

    let token = (await this.getToken(headers)) ?? { user: {} };
    if (this.config?.callbacks?.jwt) {
      token = await this.config.callbacks.jwt(token, profile);
    } else {
      token = this.setToken(headers, { user: profile });
    }

    const jwt = this.signToken(token);
    const redirect = await this.getRedirectUrl(url.host, redirectUrl ?? undefined);

    return {
      status: 302,
      headers: {
        "set-cookie": `${this.cookieName}=${jwt}; Path=/; HttpOnly`,
        Location: redirect,
      },
    };
  }

  async handleEndpoint(event: RequestEvent): Promise<EndpointOutput> {
    const { headers, method } = event.request;
    const { url } = event;

    if (url.pathname === this.getPath("signout")) {
      const token = this.setToken(event.request.headers, {});
      const jwt = this.signToken(token);

      if (method === "POST") {
        return {
          headers: {
            "set-cookie": `${this.cookieName}=${jwt}; Path=/; HttpOnly`,
          },
          body: {
            signout: true,
          },
        };
      }

      const redirect = await this.getRedirectUrl(url.host);

      return {
        status: 302,
        headers: {
          "set-cookie": `${this.cookieName}=${jwt}; Path=/; HttpOnly`,
          Location: redirect,
        },
      };
    }

    const regex = new RegExp(join([this.basePath, `(?<method>signin|callback)/(?<provider>\\w+)`]));
    const match = url.pathname.match(regex);

    if (match && match.groups) {
      const provider = this.config?.providers?.find(
        (provider) => provider.id === match.groups!.provider,
      );
      if (provider) {
        if (match.groups.method === "signin") {
          return await provider.signin(event, this);
        } else {
          return await this.handleProviderCallback(event, provider);
        }
      }
    }

    return {
      status: 404,
      body: "Not found.",
    };
  }

  GET: RequestHandler = async (event: RequestEvent): Promise<any> => {
    const { url } = event;

    if (url.pathname === this.getPath("csrf")) {
      return { body: "1234" }; // TODO: Generate real token
    } else if (url.pathname === this.getPath("session")) {
      const session = await this.getSession(event);
      return {
        body: {
          session,
        },
      };
    }

    return await this.handleEndpoint(event);
  };

  POST: RequestHandler = async (event: RequestEvent) => {
    return await this.handleEndpoint(event);
  };

  getSession: GetSession = async (event: RequestEvent) => {
    const { request } = event;
    const token = await this.getToken(request.headers);

    if (token) {
      if (this.config?.callbacks?.session) {
        return await this.config.callbacks.session(token, { user: token.user });
      }

      return { user: token.user };
    }

    return {};
  };
}
