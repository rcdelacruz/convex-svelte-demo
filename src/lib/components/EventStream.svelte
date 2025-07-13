<script lang="ts">
  export let events: any;
  
  function formatTime(timestamp: number) {
    return new Date(timestamp).toLocaleTimeString();
  }
  
  function getEventIcon(type: string) {
    switch (type) {
      case 'message_sent':
        return '💬';
      case 'message_deleted':
        return '🗑️';
      case 'task_created':
        return '✅';
      case 'task_updated':
        return '🔄';
      case 'task_deleted':
        return '❌';
      default:
        return '📝';
    }
  }
  
  function getEventDescription(event: any) {
    switch (event.type) {
      case 'message_sent':
        return `${event.data.author} sent: "${event.data.body}"`;
      case 'message_deleted':
        return 'A message was deleted';
      case 'task_created':
        return `New task created: "${event.data.title}"`;
      case 'task_updated':
        return `Task ${event.data.completed ? 'completed' : 'reopened'}`;
      case 'task_deleted':
        return 'A task was deleted';
      default:
        return `Event: ${event.type}`;
    }
  }
</script>

<div class="space-y-2 max-h-64 overflow-y-auto">
  {#if events.isLoading}
    <div class="loading">
      <div class="space-y-2">
        {#each Array(3) as _}
          <div class="bg-gray-200 h-8 rounded animate-pulse"></div>
        {/each}
      </div>
    </div>
  {:else if events.error}
    <div class="text-red-600 p-4 bg-red-50 rounded-md">
      Error loading events: {events.error.toString()}
    </div>
  {:else if events.data && events.data.length > 0}
    {#each events.data as event (event._id)}
      <div class="flex items-center gap-3 p-2 bg-gray-50 rounded-md text-sm">
        <span class="text-lg">{getEventIcon(event.type)}</span>
        <div class="flex-1">
          <span class="text-gray-700">{getEventDescription(event)}</span>
        </div>
        <span class="text-xs text-gray-500">{formatTime(event.timestamp)}</span>
      </div>
    {/each}
  {:else}
    <div class="text-center text-gray-500 py-4">
      <p>No recent events</p>
    </div>
  {/if}
</div>

<!-- Real-time indicator -->
<div class="mt-4 text-center">
  <div class="inline-flex items-center gap-2 text-xs text-gray-500">
    <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
    Live event stream
  </div>
</div>
