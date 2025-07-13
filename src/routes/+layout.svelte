<script>
  import '../app.css';
  import { browser } from '$app/environment';
  import { setupConvex } from 'convex-svelte';
  import { PUBLIC_CONVEX_URL } from '$env/static/public';

  // Initialize Convex immediately for client-side
  if (browser) {
    setupConvex(PUBLIC_CONVEX_URL);
  }
</script>

<main>
  <slot />
</main>
