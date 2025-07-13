import { ConvexClient } from "convex/browser";
import { setupConvex } from "convex-svelte";
import { PUBLIC_CONVEX_URL } from "$env/static/public";

// Initialize the Convex client
export const convex = new ConvexClient(PUBLIC_CONVEX_URL);

// Setup Convex for Svelte
export function initializeConvex() {
  setupConvex(PUBLIC_CONVEX_URL);
}

// Export the client for direct use if needed
export default convex;
