import { session as session$ } from "$app/stores";

export async function signOut() {
  const res = await fetch("/api/auth/signout", { method: "POST" });
  const { signout } = await res.json();

  fetch("/api/auth/session")
    .then((res) => res.json())
    .then(session$.set);

  return signout === true;
}
