async function signOut(config) {
  let res = await fetch(mergePath(["/api/auth", config?.basePath ?? null], "signout"), {
    method: "POST"
  });
  const { signout } = await res.json();
  if (!signout) {
    throw new Error("Sign out not successful!");
  }
  res = await fetch(mergePath(["/api/auth", config?.basePath ?? null], "session"));
  const session = await res.json();
  return session;
}

export { signOut };
//# sourceMappingURL=signOut.esm.js.map
