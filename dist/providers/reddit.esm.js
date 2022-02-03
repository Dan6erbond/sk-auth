import { OAuth2Provider } from './oauth2.esm.js';
import '../helpers.esm.js';
import './oauth2.base.esm.js';
import './base.esm.js';

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
class RedditOAuth2Provider extends OAuth2Provider {
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

export { RedditOAuth2Provider };
//# sourceMappingURL=reddit.esm.js.map
