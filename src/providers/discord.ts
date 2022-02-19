import { OAuth2Provider, OAuth2ProviderConfig } from "./oauth2";

/**
 * https://discord.com/developers/docs/topics/oauth2#get-current-authorization-information
 */
export interface DiscordProfile {
  /**
   * the current application
   */
  application: Partial<DiscordApplication>;
  /**
   * the scopes the user has authorized the application for
   */
  scopes: string[];
  /**
   * when the access token expires
   */
  expires: string;
  /**
   * the user who has authorized, if the user has authorized with the identify scope
   */
  user?: DiscordUser;
}

export interface DiscordApplication {
  /**
   * the id of the app
   */
  id: string;
  /**
   * the name of the app
   */
  name: string;
  /**
   * the icon hash of the app
   */
  icon?: string;
  /**
   * the description of the app
   */
  description: string;
  /**
   * an array of rpc origin urls, if rpc is enabled
   */
  rpc_origins?: string[];
  /**
   * when false only app owner can join the app's bot to guilds
   */
  bot_public: boolean;
  /**
   * when true the app's bot will only join upon completion of the full oauth2 code grant flow
   */
  bot_require_code_grant: boolean;
  /**
   * the url of the app's terms of service
   */
  terms_of_service_url?: string;
  /**
   * partial user object containing info on the owner of the application
   */
  owner?: Partial<DiscordUser>;
  /**
   * if this application is a game sold on Discord, this field will be the summary field for the store page of its primary sku
   */
  summary: string;
  /**
   * the hex encoded key for verification in interactions and the GameSDK's GetTicket
   */
  verify_key: string;
  /**
   * if the application belongs to a team, this will be a list of the members of that team
   */
  team?: DiscordTeam;
  /**
   * if this application is a game sold on Discord, this field will be the guild to which it has been linked
   */
  guild_id?: string;
  /**
   * if this application is a game sold on Discord, this field will be the id of the "Game SKU" that is created, if exists
   */
  primary_sku_id?: string;
  /**
   * if this application is a game sold on Discord, this field will be the URL slug that links to the store page
   */
  slug?: string;
  /**
   * the application's default rich presence invite cover image hash
   */
  cover_image?: string;
  /**
   * the application's public flags
   */
  flags?: number;
}

export interface DiscordUser {
  /**
   * the user's id
   */
  id: string;
  /**
   * the user's username, not unique across the platform
   */
  username: string;
  /**
   * the user's 4-digit discord-tag
   */
  discriminator: string;
  /**
   * the user's avatar hash
   */
  avatar?: string;
  /**
   * whether the user belongs to an OAuth2 application
   */
  bot?: boolean;
  /**
   * whether the user is an Official Discord System user (part of the urgent message system)
   */
  system?: boolean;
  /**
   * whether the user has two factor enabled on their account
   */
  mfa_enabled?: boolean;
  /**
   * the user's banner hash
   */
  banner?: string;
  /**
   * the user's banner color encoded as an integer representation of hexadecimal color code
   */
  accent_color?: number;
  /**
   * the user's chosen language option
   */
  locale?: string;
  /**
   * whether the email on this account has been verified
   */
  verified?: boolean;
  /**
   * the user's email
   */
  email?: string;
  /**
   * the flags on a user's account
   */
  flags?: number;
  /**
   * the type of Nitro subscription on a user's account
   */
  premium_type?: number;
  /**
   * the public flags on a user's account
   */
  public_flags?: number;
}

export interface DiscordTeam {
  /**
   * the unique id of the team
   */
  id: string;
  /**
   * a hash of the image of the team's icon
   */
  icon?: string;
  /**
   * the members of the team
   */
  members: DiscordTeamMember[];
  /**
   * the name of the team
   */
  name: string;
  /**
   * the user id of the current team owner
   */
  owner_user_id: string;
}

export interface DiscordTeamMember {
  /**
   * the user's membership state on the team
   */
  membership_state: number;
  /**
   * will always be ["*"]
   */
  permissions: string[];
  /**
   * the id of the parent team of which they are a member
   */
  team_id: string;
  /**
   * the avatar, discriminator, id, and username of the user
   */
  user: Partial<DiscordUser>;
}

export interface DiscordTokens {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

interface DiscordOAuth2ProviderConfig extends OAuth2ProviderConfig<DiscordProfile, DiscordTokens> {
  /**
   * prompt controls how the authorization flow handles existing authorizations. If a user has previously authorized your application with the requested scopes and prompt is set to consent, it will request them to reapprove their authorization. If set to none, it will skip the authorization screen and redirect them back to your redirect URI without requesting their authorization. For passthrough scopes, like bot and webhook.incoming, authorization is always required.
   */
  prompt: "consent" | "none";
}

const defaultConfig: Partial<DiscordOAuth2ProviderConfig> = {
  id: "discord",
  scope: "identify email",
  accessTokenUrl: "https://discord.com/api/oauth2/token",
  authorizationUrl: "https://discord.com/api/oauth2/authorize",
  profileUrl: "https://discord.com/api/users/@me",
  contentType: "application/x-www-form-urlencoded",
};

export class DiscordOAuth2Provider extends OAuth2Provider<
  DiscordProfile,
  DiscordTokens,
  DiscordOAuth2ProviderConfig
> {
  constructor(config: DiscordOAuth2ProviderConfig) {
    super({
      ...defaultConfig,
      ...config,
    });
  }
}
