<script lang="ts">
  import { useConvexClient } from 'convex-svelte';
  import { api } from '../../../convex/_generated/api';
  import { browser } from '$app/environment';

  export let messages: any;

  let client: any = null;

  if (browser) {
    try {
      client = useConvexClient();
    } catch (error) {
      console.error('Failed to get Convex client:', error);
    }
  }

  async function deleteMessage(id: string) {
    if (client) {
      try {
        await client.mutation(api.messages.remove, { id });
      } catch (error) {
        console.error('Failed to delete message:', error);
      }
    } else {
      // Demo mode - remove from local data
      if (messages.data) {
        messages.data = messages.data.filter((msg: any) => msg._id !== id);
      }
    }
  }

  function formatTime(timestamp: number) {
    return new Date(timestamp).toLocaleTimeString();
  }
</script>

<div class="space-y-3 max-h-96 overflow-y-auto">
  {#if messages.isLoading}
    <div class="loading">
      <div class="space-y-2">
        {#each Array(3) as _}
          <div class="bg-gray-200 h-16 rounded animate-pulse"></div>
        {/each}
      </div>
    </div>
  {:else if messages.error}
    <div class="text-red-600 p-4 bg-red-50 rounded-md">
      Error loading messages: {messages.error.toString()}
    </div>
  {:else if messages.data && messages.data.length > 0}
    {#each messages.data as message (message._id)}
      <div class="bg-gray-50 p-4 rounded-md border-l-4 border-blue-500">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-semibold text-gray-900">{message.author}</span>
              <span class="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
            </div>
            <p class="text-gray-700">{message.body}</p>
          </div>
          <button
            on:click={() => deleteMessage(message._id)}
            class="text-red-500 hover:text-red-700 ml-2 p-1"
            title="Delete message"
            aria-label="Delete message"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    {/each}
  {:else}
    <div class="text-center text-gray-500 py-8">
      <p>No messages yet. Send the first one!</p>
    </div>
  {/if}
</div>
