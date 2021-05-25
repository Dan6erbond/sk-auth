<script context="module">
  import { dev } from "$app/env";
  import clsx from "clsx";
  import Prism from "prismjs";
  import { onMount } from "svelte";
  import "prismjs/plugins/toolbar/prism-toolbar.css";
  import "prismjs/themes/prism-tomorrow.css";
  import "clipboard";

  export const hydrate = dev;
</script>

<script lang="ts">
  const code = `export const appAuth = new SvelteKitAuth({
  providers: [
    new GoogleOAuthProvider({
      clientId: process.env['VITE_GOOGLE_OAUTH_CLIENT_ID'],
      clientSecret: process.env['GOOGLE_OAUTH_CLIENT_SECRET'],
      profile(profile) {
        return { ...profile, provider: "google" };
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
            ...token.user,
            connections: { [provider]: account },
          },
        };
      }

      return token;
    },
  },
  jwtSecret: process.env['JWT_SECRET_KEY'],
});`;

  onMount(async () => {
    await import("prismjs/components/prism-clike");
    await import("prismjs/components/prism-javascript");
    await import("prismjs/components/prism-typescript");
    Prism.highlightAll();
  });
</script>

<div class={clsx("flex", "justify-center", "items-center", "p-6", "md:p-12", "mb-6", "md:mb-12")}>
  <img src="/logo.svg" class="h-36 md:h-48" alt="" />
  <div class={clsx("space-y-6")}>
    <h1 class={clsx("text-center", "text-5xl", "md:text-6xl", "lg:text-7xl", "font-bold")}>
      SvelteKitAuth
    </h1>
    <p class={clsx("text-center", "text-xl")}>
      Authentication built from the ground up for SvelteKit.
    </p>
  </div>
</div>

<div class={clsx("flex", "justify-between", "mb-6", "md:mb-12")}>
  <div class={clsx("flex-1", "p-4")}>
    <p class={clsx("font-bold", "text-xl", "text-center", "mb-6")}>Easy</p>
    <ul class={clsx("text-center", "space-y-2")}>
      <ol>Supports OAuth and credential login out of the box</ol>
      <ol>Works with SvelteKit and Vite</ol>
      <ol>Easily extensible with alternative providers</ol>
      <ol>Build dynamic login screens and fetch sessions using client helpers within minutes</ol>
    </ul>
  </div>
  <div class={clsx("flex-1", "p-4")}>
    <p class={clsx("font-bold", "text-xl", "text-center", "mb-6")}>Flexible</p>
    <ul class={clsx("text-center", "space-y-2")}>
      <ol>Add new providers in minutes with class-based architecture</ol>
      <ol>Connect to a custom backend with callbacks</ol>
      <ol>Transform the session and JWT as you like using hooks</ol>
      <ol>Fetch additional account information after the initial sign-on</ol>
    </ul>
  </div>
  <div class={clsx("flex-1", "p-4")}>
    <p class={clsx("font-bold", "text-xl", "text-center", "mb-6")}>Secure</p>
    <ul class={clsx("text-center", "space-y-2")}>
      <ol>Uses signed JWT and HTTP-only cookies for secure sessions</ol>
      <ol>Allows you to manually sign and secure JWTs using an object-oriented approach</ol>
      <ol>Replay and state validation with supporting providers</ol>
      <ol>CSRF token validation</ol>
    </ul>
  </div>
</div>

<p class={clsx("text-2xl", "text-center", "mb-2")}>Dead-Simple Authentication in Minutes!</p>
<p class={clsx("text-lg", "text-center", "mb-6")}>Test it out for yourself <a href="/login" class={clsx("hover:text-orange-500", "transition-colors")}>here</a>.</p>

<pre class="language-ts">
  <code class="language-ts">
    {code}
  </code>
</pre>
