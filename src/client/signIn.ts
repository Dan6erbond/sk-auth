import { goto } from "$app/navigation";
import { page } from "$app/stores";
import type { Page } from "@sveltejs/kit";

interface SignInConfig {
  redirectUrl?: string;
}

export async function signIn(provider: string, data?: any, config?: SignInConfig) {
  if (data) {
    const path = `/api/auth/callback/${provider}`;
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
    let $val: Page | undefined;
    page.subscribe(($) => ($val = $))();
    if ($val) {
      redirectUrl = `${$val.host}${$val.path}?${$val.query}`;
    }
  }

  const queryData = {
    redirect: redirectUrl ?? "/",
  };
  const query = new URLSearchParams(queryData);
  const path = `/api/auth/login/${provider}?${query}`;

  return await goto(path);
}
