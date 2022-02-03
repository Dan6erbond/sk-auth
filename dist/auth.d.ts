import type { GetSession, RequestHandler } from "@sveltejs/kit";
import type { EndpointOutput } from "@sveltejs/kit/types/endpoint";
import { RequestEvent } from "@sveltejs/kit/types/hooks";
import type { JWT, Session } from "./interfaces";
import type { Provider } from "./providers";
interface AuthConfig {
    providers: Provider[];
    callbacks?: AuthCallbacks;
    jwtSecret?: string;
    jwtExpiresIn?: string | number;
    host?: string;
    protocol?: string;
    basePath?: string;
}
interface AuthCallbacks {
    signIn?: () => boolean | Promise<boolean>;
    jwt?: (token: JWT, profile?: any) => JWT | Promise<JWT>;
    session?: (token: JWT, session: Session) => Session | Promise<Session>;
    redirect?: (url: string) => string | Promise<string>;
}
export declare class Auth {
    private readonly config?;
    constructor(config?: AuthConfig | undefined);
    get basePath(): string;
    getJwtSecret(): string;
    getToken(headers: any): Promise<JWT | null>;
    getBaseUrl(host?: string): string;
    getPath(path: string): string;
    getUrl(path: string, host?: string): string;
    setToken(headers: any, newToken: JWT | any): any;
    signToken(token: JWT): string;
    getRedirectUrl(host: string, redirectUrl?: string): Promise<string>;
    handleProviderCallback(event: RequestEvent, provider: Provider): Promise<EndpointOutput>;
    handleEndpoint(event: RequestEvent): Promise<EndpointOutput>;
    get: RequestHandler;
    post: RequestHandler;
    getSession: GetSession;
}
export {};
