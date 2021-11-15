import { OAuth2Provider, OAuth2ProviderConfig } from "./oauth2";

export interface OktaAddress {
  street_address: string;
  locality: string;
  region: string;
  postal_code: string;
  country: string;
}

export interface OktaProfile {
  sub: string;
  name: string;
  nickname: string;
  given_name: string;
  middle_name: string;
  family_name: string;
  profile: string;
  zoneinfo: string;
  locale: string;
  updated_at: number;
  email: string;
  email_verified: boolean;
  address: OktaAddress;
  phone_number: string;
}

export interface OktaTokens {
  access_token: string;
  code: string;
  error: string;
  error_description: string;
  expires_in: string;
  id_token: string;
  scope: string;
  state: string;
  token_type: string;
}

type OktaOAuth2ProviderConfig = OAuth2ProviderConfig<OktaProfile, OktaTokens>;

interface OktaRequiredConfig extends OktaOAuth2ProviderConfig {
  oktaDomain: string;
  authorizationServer?: string;
}

const defaultConfig: Partial<OktaRequiredConfig> = {
  id: "okta",
  scope: ["openid", "profile", "email"],
  accessTokenUrl: "/v1/token",
  authorizationUrl: "/v1/authorize",
  profileUrl: "/v1/userinfo",
  authorizationServer: "default",
  contentType: "application/x-www-form-urlencoded",
};

/**
 * Sign in with Okta. Requires the `oktaDomain` parameter.
 * Default authorization server value is `default`
 */
export class OktaOAuth2Provider extends OAuth2Provider<
  OktaProfile,
  OktaTokens,
  OktaOAuth2ProviderConfig
> {
  constructor(config: OktaRequiredConfig) {
    /**
     * Either generate full okta urls using the required oktaDomain,
     * or pull them directly from the values in
     * `config.accessTokenUrl`, `config.authorizationUrl`, or `config.profileUrl`
     */
    const constructedUrls: Partial<OktaOAuth2ProviderConfig> = {
      accessTokenUrl:
        config.accessTokenUrl ||
        `https://${config.oktaDomain}/oauth2/${
          config.authorizationServer || defaultConfig.authorizationServer
        }${defaultConfig.accessTokenUrl}`,
      authorizationUrl:
        config.authorizationUrl ||
        `https://${config.oktaDomain}/oauth2/${
          config.authorizationServer || defaultConfig.authorizationServer
        }${defaultConfig.authorizationUrl}`,
      profileUrl:
        config.profileUrl ||
        `https://${config.oktaDomain}/oauth2/${
          config.authorizationServer || defaultConfig.authorizationServer
        }${defaultConfig.profileUrl}`,
    };
    super({
      ...defaultConfig,
      ...constructedUrls,
      ...config,
    });
  }
}
