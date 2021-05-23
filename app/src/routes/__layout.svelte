<script lang="ts">
  import "../app.postcss";
  import { page, session } from "$app/stores";
  import { signOut as authSignOut } from "sk-auth/client";
  import clsx from "clsx";

  function signOut() {
    authSignOut().then(session.set);
  }
</script>

<svelte:head>
  <title>SvelteKitAuth</title>
</svelte:head>

<header
  class={clsx(
    "flex",
    "justify-between",
    "fixed",
    "top-0",
    "left-0",
    "right-0",
    "w-full",
    "p-4",
    "items-center",
    "shadow-md",
    "bg-white",
  )}
>
  <a href="/" class={clsx("flex", "items-center", "space-x-2")}>
    <img src="/logo.svg" class={clsx("h-8", "w-8")} alt="SvelteKitAuth Logo" />
    <span class={clsx("text-2xl", "text-orange-500")}>SvelteKitAuth</span>
  </a>
  <div class={clsx("flex", "items-center", "space-x-2")}>
    {#if $session?.user}
      <a
        href="/profile"
        class={clsx(
          "flex",
          "items-center",
          "justify-center",
          "hover:no-underline",
          "hover:bg-orange-50",
          "transition-colors",
          "p-2",
          "rounded-full",
        )}
      >
        {#if $page.path === "/profile"}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class={clsx("h-6", "w-6")}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clip-rule="evenodd"
            />
          </svg>
        {:else}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class={clsx("h-6", "w-6")}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        {/if}
      </a>
      <button
        class={clsx(
          "flex",
          "items-center",
          "justify-center",
          "hover:no-underline",
          "hover:bg-orange-50",
          "transition-colors",
          "p-2",
          "rounded-full",
        )}
        on:click={signOut}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class={clsx("h-6", "w-6")}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
      </button>
    {:else}
      <a
        href="/login"
        class={clsx(
          "flex",
          "items-center",
          "justify-center",
          "hover:no-underline",
          "hover:bg-orange-50",
          "transition-colors",
          "p-2",
          "rounded-full",
        )}
        class:text-orange-500={$page.path === "/login"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class={clsx("h-6", "w-6")}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
          />
        </svg>
      </a>
    {/if}
    <a
      href="https://github.com/Dan6erbond/SvelteKitAuth"
      target="_blank"
      class={clsx(
        "flex",
        "items-center",
        "justify-center",
        "hover:no-underline",
        "hover:bg-orange-50",
        "transition-colors",
        "p-2",
        "rounded-full",
      )}
    >
      <svg class={clsx("h-6", "w-6")} viewBox="0 0 128 128">
        <g fill="currentColor">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M64 5.103c-33.347 0-60.388 27.035-60.388 60.388 0 26.682 17.303 49.317 41.297 57.303 3.017.56 4.125-1.31 4.125-2.905 0-1.44-.056-6.197-.082-11.243-16.8 3.653-20.345-7.125-20.345-7.125-2.747-6.98-6.705-8.836-6.705-8.836-5.48-3.748.413-3.67.413-3.67 6.063.425 9.257 6.223 9.257 6.223 5.386 9.23 14.127 6.562 17.573 5.02.542-3.903 2.107-6.568 3.834-8.076-13.413-1.525-27.514-6.704-27.514-29.843 0-6.593 2.36-11.98 6.223-16.21-.628-1.52-2.695-7.662.584-15.98 0 0 5.07-1.623 16.61 6.19C53.7 35 58.867 34.327 64 34.304c5.13.023 10.3.694 15.127 2.033 11.526-7.813 16.59-6.19 16.59-6.19 3.287 8.317 1.22 14.46.593 15.98 3.872 4.23 6.215 9.617 6.215 16.21 0 23.194-14.127 28.3-27.574 29.796 2.167 1.874 4.097 5.55 4.097 11.183 0 8.08-.07 14.583-.07 16.572 0 1.607 1.088 3.49 4.148 2.897 23.98-7.994 41.263-30.622 41.263-57.294C124.388 32.14 97.35 5.104 64 5.104z"
          />
          <path
            d="M26.484 91.806c-.133.3-.605.39-1.035.185-.44-.196-.685-.605-.543-.906.13-.31.603-.395 1.04-.188.44.197.69.61.537.91zm-.743-.55M28.93 94.535c-.287.267-.85.143-1.232-.28-.396-.42-.47-.983-.177-1.254.298-.266.844-.14 1.24.28.394.426.472.984.17 1.255zm-.575-.618M31.312 98.012c-.37.258-.976.017-1.35-.52-.37-.538-.37-1.183.01-1.44.373-.258.97-.025 1.35.507.368.545.368 1.19-.01 1.452zm0 0M34.573 101.373c-.33.365-1.036.267-1.552-.23-.527-.487-.674-1.18-.343-1.544.336-.366 1.045-.264 1.564.23.527.486.686 1.18.333 1.543zm0 0M39.073 103.324c-.147.473-.825.688-1.51.486-.683-.207-1.13-.76-.99-1.238.14-.477.823-.7 1.512-.485.683.206 1.13.756.988 1.237zm0 0M44.016 103.685c.017.498-.563.91-1.28.92-.723.017-1.308-.387-1.315-.877 0-.503.568-.91 1.29-.924.717-.013 1.306.387 1.306.88zm0 0M48.614 102.903c.086.485-.413.984-1.126 1.117-.7.13-1.35-.172-1.44-.653-.086-.498.422-.997 1.122-1.126.714-.123 1.354.17 1.444.663zm0 0"
          />
        </g>
      </svg>
    </a>
  </div>
</header>

<main
  class={clsx(
    "flex",
    "flex-1",
    "flex-col",
    "p-4",
    "w-full",
    "max-w-5xl",
    "my-0",
    "mx-auto",
    "box-border",
    "mt-16",
    "md:mt-20",
    "md:px-6",
  )}
>
  <slot />
</main>

<footer
  class={clsx(
    "p-4",
    "md:p-8",
    "shadow-2xl",
    "w-full",
    "flex",
    "items-center",
    "flex-col",
    "bg-orange-600",
    "text-white",
  )}
>
  <span>© RaviAnand M, 2021</span>
</footer>
