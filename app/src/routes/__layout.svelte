<script lang="ts">
  import "../app.postcss";
</script>

<main>
  <slot />
</main>

<style lang="postcss">
  main {
    @apply flex flex-1 flex-col p-4 w-full max-w-5xl my-0 mx-auto box-border mt-20;
  }
</style>
