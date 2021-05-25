/// <reference types="@sveltejs/kit" />

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ImportMetaEnv {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GOOGLE_OAUTH_CLIENT_ID: string;
      GOOGLE_OAUTH_CLIENT_SECRET: string;
      FACEBOOK_OAUTH_CLIENT_ID: string;
      FACEBOOK_OAUTH_CLIENT_SECRET: string;
      TWITTER_API_KEY: string;
      TWITTER_API_SECRET: string;
      REDDIT_API_KEY: string;
      REDDIT_API_SECRET: string;
      JWT_SECRET_KEY: string;
      NODE_ENV: "development" | "production";
      PORT?: string;
      PWD: string;
    }
  }
}
