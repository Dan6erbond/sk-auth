import { SvelteKitAuth } from "sk-auth";
import {
  FacebookOAuth2Provider,
  GoogleOAuth2Provider,
  RedditOAuth2Provider,
  TwitterAuthProvider,
} from "sk-auth/providers";

export const appAuth = new SvelteKitAuth({
  providers: [
    new GoogleOAuth2Provider({
      clientId: import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_SECRET,
      profile(profile) {
        return { ...profile, provider: "google" };
      },
    }),
    new FacebookOAuth2Provider({
      clientId: import.meta.env.VITE_FACEBOOK_OAUTH_CLIENT_ID,
      clientSecret: import.meta.env.VITE_FACEBOOK_OAUTH_CLIENT_SECRET,
      profile(profile) {
        return { ...profile, provider: "facebook" };
      },
    }),
    new TwitterAuthProvider({
      apiKey: import.meta.env.VITE_TWITTER_API_KEY,
      apiSecret: import.meta.env.VITE_TWITTER_API_SECRET,
      profile(profile) {
        return { ...profile, provider: "twitter" };
      },
    }),
    new RedditOAuth2Provider({
      apiKey: import.meta.env.VITE_REDDIT_API_KEY,
      apiSecret: import.meta.env.VITE_REDDIT_API_SECRET,
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
  jwtSecret: import.meta.env.JWT_SECRET_KEY,
});
