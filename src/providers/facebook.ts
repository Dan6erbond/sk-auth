import { OAuth2Provider, OAuth2ProviderConfig } from "./oauth2";

export interface FacebookProfile {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  name_format: string;
  picture: { data: { height: number; is_silhouette: boolean; url: string; width: number } };
  short_name: string;
  email: string;
}

export interface FacebookTokens {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface FacebookOAuth2ProviderConfig<ProfileType = FacebookProfile>
  extends OAuth2ProviderConfig<ProfileType, FacebookTokens> {
  userProfileFields?: string | (keyof ProfileType)[] | (string | number | symbol)[];
}

const defaultConfig: Partial<FacebookOAuth2ProviderConfig<any>> = {
  id: "facebook",
  scope: ["email", "public_profile", "user_link"],
  userProfileFields: [
    "id",
    "name",
    "first_name",
    "last_name",
    "middle_name",
    "name_format",
    "picture",
    "short_name",
    "email",
  ],
  profileUrl: "https://graph.facebook.com/me",
  authorizationUrl: "https://www.facebook.com/v10.0/dialog/oauth",
  accessTokenUrl: "https://graph.facebook.com/v10.0/oauth/access_token",
};

export class FacebookOAuth2Provider<ProfileType = FacebookProfile> extends OAuth2Provider<
  ProfileType,
  FacebookTokens,
  FacebookOAuth2ProviderConfig<ProfileType>
> {
  constructor(config: FacebookOAuth2ProviderConfig<ProfileType>) {
    const userProfileFields = config.userProfileFields ?? defaultConfig.userProfileFields;
    const data = {
      fields: Array.isArray(userProfileFields) ? userProfileFields.join(",") : userProfileFields!,
    };
    const profileUrl = `${config.profileUrl ?? defaultConfig.profileUrl}?${new URLSearchParams(
      data,
    )}`;

    super({
      ...defaultConfig,
      ...config,
      profileUrl,
    });
  }
}
