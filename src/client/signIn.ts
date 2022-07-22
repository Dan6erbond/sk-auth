/* import { goto } from "@sveltejs/kit/assets/runtime/app/navigation";
import { page } from "@sveltejs/kit/assets/runtime/app/stores"; */
import type { LoadInput } from "@sveltejs/kit";
import type { ClientRequestConfig } from "./types";
import { mergePath } from "./helpers";

interface SignInConfig extends ClientRequestConfig {
  redirectUrl?: string;
}

export async function signIn(provider: string, data?: any, config?: SignInConfig) {
  if (data) {
    const path = mergePath(["/api/auth", config?.basePath ?? null], `/callback/${provider}`);
    const res = await fetch(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await res.json();
  }

  let redirectUrl: string | undefined;
  if (config?.redirectUrl) {
    redirectUrl = config.redirectUrl;
  } else {
    let $val: LoadInput | undefined;
    /* page.subscribe(($) => ($val = $))(); */
    if ($val) {
      redirectUrl = `${$val.url.host}${$val.url.pathname}?${$val.url.searchParams}`;
    }
  }

  const queryData = {
    redirect: redirectUrl ?? "/",
  };
  const query = new URLSearchParams(queryData);
  const path = mergePath(["/api/auth", config?.basePath ?? null], `/signin/${provider}?${query}`);

  return path; // await goto(path);
}
