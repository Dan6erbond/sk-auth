import { Provider } from './base.esm.js';

class OAuth2BaseProvider extends Provider {
  async signin(event, auth) {
    const { method } = event.request;
    const { url } = event;
    const state = [
      `redirect=${url.searchParams.get("redirect") ?? this.getUri(auth, "/", url.host)}`
    ].join(",");
    const base64State = Buffer.from(state).toString("base64");
    const nonce = Math.round(Math.random() * 1e3).toString();
    const authUrl = await this.getAuthorizationUrl(event, auth, base64State, nonce);
    if (method === "POST") {
      return {
        body: {
          redirect: authUrl
        }
      };
    }
    return {
      status: 302,
      headers: {
        Location: authUrl
      }
    };
  }
  getStateValue(query, name) {
    if (query.get("state")) {
      const state = Buffer.from(query.get("state"), "base64").toString();
      return state.split(",").find((state2) => state2.startsWith(`${name}=`))?.replace(`${name}=`, "");
    }
  }
  async callback(event, auth) {
    const { request, url } = event;
    const code = url.searchParams.get("code");
    const redirect = this.getStateValue(url.searchParams, "redirect");
    const tokens = await this.getTokens(code, this.getCallbackUri(auth, url.host));
    let user = await this.getUserProfile(tokens);
    if (this.config.profile) {
      user = await this.config.profile(user, tokens);
    }
    return [user, redirect ?? this.getUri(auth, "/", url.host)];
  }
}

export { OAuth2BaseProvider };
//# sourceMappingURL=oauth2.base.esm.js.map
