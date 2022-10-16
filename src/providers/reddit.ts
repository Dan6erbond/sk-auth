import { base64Encode } from "../helpers";
import { OAuth2Provider, OAuth2ProviderConfig } from "./oauth2";

export interface RedditProfile {
  is_employee: boolean;
  seen_layout_switch: boolean;
  has_visited_new_profile: boolean;
  pref_no_profanity: boolean;
  has_external_account: boolean;
  pref_geopopular: string;
  seen_redesign_modal: boolean;
  pref_show_trending: boolean;
  subreddit: Subreddit;
  pref_show_presence: boolean;
  snoovatar_img: string;
  snoovatar_size: number[];
  gold_expiration: number;
  has_gold_subscription: boolean;
  is_sponsor: boolean;
  num_friends: number;
  features: Features;
  can_edit_name: boolean;
  verified: boolean;
  pref_autoplay: boolean;
  coins: number;
  has_paypal_subscription: boolean;
  has_subscribed_to_premium: boolean;
  id: string;
  has_stripe_subscription: boolean;
  oauth_client_id: string;
  can_create_subreddit: boolean;
  over_18: boolean;
  is_gold: boolean;
  is_mod: boolean;
  awarder_karma: number;
  suspension_expiration_utc: null;
  has_verified_email: boolean;
  is_suspended: boolean;
  pref_video_autoplay: boolean;
  has_android_subscription: boolean;
  in_redesign_beta: boolean;
  icon_img: string;
  pref_nightmode: boolean;
  awardee_karma: number;
  hide_from_robots: boolean;
  password_set: boolean;
  link_karma: number;
  force_password_reset: boolean;
  total_karma: number;
  seen_give_award_tooltip: boolean;
  inbox_count: number;
  seen_premium_adblock_modal: boolean;
  pref_top_karma_subreddits: boolean;
  pref_show_snoovatar: boolean;
  name: string;
  pref_clickgadget: number;
  created: number;
  gold_creddits: number;
  created_utc: number;
  has_ios_subscription: boolean;
  pref_show_twitter: boolean;
  in_beta: boolean;
  comment_karma: number;
  has_subscribed: boolean;
  linked_identities: string[];
  seen_subreddit_chat_ftux: boolean;
}

export interface Features {
  mod_service_mute_writes: boolean;
  promoted_trend_blanks: boolean;
  show_amp_link: boolean;
  chat: boolean;
  is_email_permission_required: boolean;
  mod_awards: boolean;
  expensive_coins_package: boolean;
  mweb_xpromo_revamp_v2: MwebXpromoRevampV;
  awards_on_streams: boolean;
  webhook_config: boolean;
  mweb_xpromo_modal_listing_click_daily_dismissible_ios: boolean;
  live_orangereds: boolean;
  modlog_copyright_removal: boolean;
  show_nps_survey: boolean;
  do_not_track: boolean;
  mod_service_mute_reads: boolean;
  chat_user_settings: boolean;
  use_pref_account_deployment: boolean;
  mweb_xpromo_interstitial_comments_ios: boolean;
  chat_subreddit: boolean;
  noreferrer_to_noopener: boolean;
  premium_subscriptions_table: boolean;
  mweb_xpromo_interstitial_comments_android: boolean;
  chat_group_rollout: boolean;
  resized_styles_images: boolean;
  spez_modal: boolean;
  mweb_xpromo_modal_listing_click_daily_dismissible_android: boolean;
  mweb_xpromo_revamp_v3: MwebXpromoRevampV;
}

export interface MwebXpromoRevampV {
  owner: string;
  variant: string;
  experiment_id: number;
}

export interface Subreddit {
  default_set: boolean;
  user_is_contributor: boolean;
  banner_img: string;
  restrict_posting: boolean;
  user_is_banned: boolean;
  free_form_reports: boolean;
  community_icon: null;
  show_media: boolean;
  icon_color: string;
  user_is_muted: boolean;
  display_name: string;
  header_img: null;
  title: string;
  coins: number;
  previous_names: any[];
  over_18: boolean;
  icon_size: number[];
  primary_color: string;
  icon_img: string;
  description: string;
  submit_link_label: string;
  header_size: null;
  restrict_commenting: boolean;
  subscribers: number;
  submit_text_label: string;
  is_default_icon: boolean;
  link_flair_position: string;
  display_name_prefixed: string;
  key_color: string;
  name: string;
  is_default_banner: boolean;
  url: string;
  quarantine: boolean;
  banner_size: number[];
  user_is_moderator: boolean;
  public_description: string;
  link_flair_enabled: boolean;
  disable_contributor_requests: boolean;
  subreddit_type: string;
  user_is_subscriber: boolean;
}

export interface RedditTokens {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

interface RedditOAuth2ProviderConfig extends OAuth2ProviderConfig<RedditProfile, RedditTokens> {
  duration?: "temporary" | "permanent";
  apiKey: string;
  apiSecret: string;
}

const redditProfileHandler = ({
  is_employee,
  has_external_account,
  snoovatar_img,
  verified,
  id,
  over_18,
  is_gold,
  is_mod,
  awarder_karma,
  has_verified_email,
  is_suspended,
  icon_img,
  pref_nightmode,
  awardee_karma,
  password_set,
  link_karma,
  total_karma,
  name,
  created,
  created_utc,
  comment_karma,
}: RedditProfile) => ({
  is_employee,
  has_external_account,
  snoovatar_img,
  verified,
  id,
  over_18,
  is_gold,
  is_mod,
  awarder_karma,
  has_verified_email,
  is_suspended,
  icon_img,
  pref_nightmode,
  awardee_karma,
  password_set,
  link_karma,
  total_karma,
  name,
  created,
  created_utc,
  comment_karma,
});

const defaultConfig: Partial<RedditOAuth2ProviderConfig> = {
  id: "reddit",
  scope: "identity",
  profile: redditProfileHandler,
  authorizationUrl: "https://www.reddit.com/api/v1/authorize",
  accessTokenUrl: "https://www.reddit.com/api/v1/access_token",
  profileUrl: "https://oauth.reddit.com/api/v1/me",
  contentType: "application/x-www-form-urlencoded",
};

export class RedditOAuth2Provider extends OAuth2Provider<
  RedditProfile,
  RedditTokens,
  RedditOAuth2ProviderConfig
> {
  constructor(config: RedditOAuth2ProviderConfig) {
    super({
      ...defaultConfig,
      ...config,
      clientId: config.apiKey,
      clientSecret: config.apiSecret,
      headers: {
        ...config.headers,
        Authorization:
          "Basic " + base64Encode(`${config.apiKey}:${config.apiSecret}`),
      },
      authorizationParams: {
        ...config.authorizationParams,
        duration: config.duration ?? "temporary",
      },
    });
  }

  static profileHandler = redditProfileHandler;
}
