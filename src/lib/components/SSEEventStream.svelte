<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  
  let events: any[] = [];
  let connectionStatus = 'disconnected';
  let eventSource: EventSource | null = null;
  let lastEventTime = 0;
  
  function formatTime(timestamp: number) {
    return new Date(timestamp).toLocaleTimeString();
  }
  
  function getEventIcon(type: string) {
    switch (type) {
      case 'connected':
        return '🔗';
      case 'heartbeat':
        return '💓';
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
      case 'error':
        return '❌';
      default:
        return '📝';
    }
  }
  
  function getEventDescription(event: any) {
    switch (event.type) {
      case 'connected':
        return 'Connected to event stream';
      case 'heartbeat':
        return 'Heartbeat';
      case 'message_sent':
        return `${event.data?.author || 'Someone'} sent: "${event.data?.body || 'message'}"`;
      case 'message_deleted':
        return 'A message was deleted';
      case 'task_created':
        return `New task created: "${event.data?.title || 'task'}"`;
      case 'task_updated':
        return `Task ${event.data?.completed ? 'completed' : 'reopened'}`;
      case 'task_deleted':
        return 'A task was deleted';
      case 'error':
        return `Error: ${event.message || 'Unknown error'}`;
      default:
        return `Event: ${event.type}`;
    }
  }
  
  function connectSSE() {
    if (!browser) return;
    
    const url = `/api/events?since=${lastEventTime}`;
    eventSource = new EventSource(url);
    
    eventSource.onopen = () => {
      connectionStatus = 'connected';
      console.log('SSE connected');
    };
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Update last event time
        if (data.timestamp) {
          lastEventTime = Math.max(lastEventTime, data.timestamp);
        }
        
        // Add to events list (keep only last 20)
        events = [data, ...events].slice(0, 20);
        
        console.log('SSE event received:', data);
      } catch (error) {
        console.error('Failed to parse SSE event:', error);
      }
    };
    
    eventSource.onerror = (error) => {
      connectionStatus = 'error';
      console.error('SSE error:', error);
      
      // Reconnect after 5 seconds
      setTimeout(() => {
        if (eventSource?.readyState === EventSource.CLOSED) {
          connectSSE();
        }
      }, 5000);
    };
  }
  
  function disconnectSSE() {
    if (eventSource) {
      eventSource.close();
      eventSource = null;
      connectionStatus = 'disconnected';
    }
  }
  
  onMount(() => {
    connectSSE();
  });
  
  onDestroy(() => {
    disconnectSSE();
  });
</script>

<div class="space-y-4">
  <!-- Connection Status -->
  <div class="flex items-center justify-between">
    <h3 class="text-lg font-semibold">Server-Sent Events Stream</h3>
    <div class="flex items-center gap-2">
      <div class="w-2 h-2 rounded-full {connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' : connectionStatus === 'error' ? 'bg-red-500' : 'bg-gray-400'}"></div>
      <span class="text-sm text-gray-600 capitalize">{connectionStatus}</span>
      <button
        on:click={connectionStatus === 'connected' ? disconnectSSE : connectSSE}
        class="btn btn-secondary text-xs px-2 py-1"
      >
        {connectionStatus === 'connected' ? 'Disconnect' : 'Connect'}
      </button>
    </div>
  </div>
  
  <!-- Events List -->
  <div class="space-y-2 max-h-64 overflow-y-auto bg-gray-50 p-4 rounded-md">
    {#if events.length > 0}
      {#each events as event, index (index)}
        <div class="flex items-center gap-3 p-2 bg-white rounded text-sm border-l-2 {event.type === 'error' ? 'border-red-500' : event.type === 'connected' ? 'border-green-500' : 'border-blue-500'}">
          <span class="text-lg">{getEventIcon(event.type)}</span>
          <div class="flex-1">
            <span class="text-gray-700">{getEventDescription(event)}</span>
          </div>
          <span class="text-xs text-gray-500">
            {event.timestamp ? formatTime(event.timestamp) : 'now'}
          </span>
        </div>
      {/each}
    {:else}
      <div class="text-center text-gray-500 py-4">
        <p>No events received yet...</p>
        {#if connectionStatus === 'connected'}
          <p class="text-xs mt-1">Waiting for real-time events...</p>
        {/if}
      </div>
    {/if}
  </div>
  
  <!-- Clear Events Button -->
  {#if events.length > 0}
    <button
      on:click={() => events = []}
      class="btn btn-secondary text-sm w-full"
    >
      Clear Events
    </button>
  {/if}
</div>
