import type { Handle } from "@sveltejs/kit";
import { appAuth } from "$lib/appAuth";

export const handle: Handle = async ({ request, render }) => {
  // TODO https://github.com/sveltejs/kit/issues/1046
  if (request.query.has("_method")) {
    request.method = request.query.get("_method").toUpperCase();
  }

  const response = await render(request);

  return response;
};

export const { getSession } = appAuth;
