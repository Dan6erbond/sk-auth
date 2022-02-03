'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var providers_oauth2 = require('./oauth2.js');
require('../helpers.js');
require('./oauth2.base.js');
require('./base.js');

const redditProfileHandler = ({ is_employee, has_external_account, snoovatar_img, verified, id, over_18, is_gold, is_mod, awarder_karma, has_verified_email, is_suspended, icon_img, pref_nightmode, awardee_karma, password_set, link_karma, total_karma, name, created, created_utc, comment_karma }) => ({
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
  comment_karma
});
const defaultConfig = {
  id: "reddit",
  scope: "identity",
  profile: redditProfileHandler,
  authorizationUrl: "https://www.reddit.com/api/v1/authorize",
  accessTokenUrl: "https://www.reddit.com/api/v1/access_token",
  profileUrl: "https://oauth.reddit.com/api/v1/me",
  contentType: "application/x-www-form-urlencoded"
};
class RedditOAuth2Provider extends providers_oauth2.OAuth2Provider {
  constructor(config) {
    super({
      ...defaultConfig,
      ...config,
      clientId: config.apiKey,
      clientSecret: config.apiSecret,
      headers: {
        ...config.headers,
        Authorization: "Basic " + Buffer.from(`${config.apiKey}:${config.apiSecret}`).toString("base64")
      },
      authorizationParams: {
        ...config.authorizationParams,
        duration: config.duration ?? "temporary"
      }
    });
  }
}
RedditOAuth2Provider.profileHandler = redditProfileHandler;

exports.RedditOAuth2Provider = RedditOAuth2Provider;
//# sourceMappingURL=reddit.js.map
