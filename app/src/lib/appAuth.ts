import { SvelteKitAuth } from "sk-auth";
import {
  FacebookOAuth2Provider,
  GoogleOAuth2Provider,
  RedditOAuth2Provider,
  TwitterAuthProvider,
} from "sk-auth/providers";
import { config } from "dotenv";

config();

export const appAuth = new SvelteKitAuth({
  providers: [
    new GoogleOAuth2Provider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      profile(profile) {
        return { ...profile, provider: "google" };
      },
    }),
    new FacebookOAuth2Provider({
      clientId: process.env.FACEBOOK_OAUTH_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_OAUTH_CLIENT_SECRET,
      profile(profile) {
        return { ...profile, provider: "facebook" };
      },
    }),
    new TwitterAuthProvider({
      apiKey: process.env.TWITTER_API_KEY,
      apiSecret: process.env.TWITTER_API_SECRET,
      profile(profile) {
        return { ...profile, provider: "twitter" };
      },
    }),
    new RedditOAuth2Provider({
      apiKey: process.env.REDDIT_API_KEY,
      apiSecret: process.env.REDDIT_API_SECRET,
      profile(profile) {
        const slim = RedditOAuth2Provider.profileHandler(profile);
        return { ...slim, provider: "reddit" };
      },
    }),
  ],
  callbacks: {
    jwt(token, profile) {
      if (profile?.provider) {
        const { provider, ...account } = profile;
        token = {
          ...token,
          user: {
            ...(token.user ?? {}),
            connections: { ...(token.user?.connections ?? {}), [provider]: account },
          },
        };
      }

      return token;
    },
  },
  jwtSecret: process.env.JWT_SECRET_KEY,
});
