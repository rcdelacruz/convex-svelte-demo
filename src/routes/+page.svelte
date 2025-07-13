<script lang="ts">
  import { useQuery, useConvexClient } from 'convex-svelte';
  import { api } from '../../convex/_generated/api';
  import MessageList from '$lib/components/MessageList.svelte';
  import TaskList from '$lib/components/TaskList.svelte';
  import EventStream from '$lib/components/EventStream.svelte';
  import SSEEventStream from '$lib/components/SSEEventStream.svelte';
  import { browser } from '$app/environment';

  let client: any = null;
  let messages: any = { isLoading: false, data: [], error: null };
  let tasks: any = { isLoading: false, data: [], error: null };
  let events: any = { isLoading: false, data: [], error: null };
  let convexAvailable = false;

  // Initialize Convex client and queries only on client side
  if (browser) {
    try {
      client = useConvexClient();
      convexAvailable = true;

      // Real-time queries
      messages = useQuery(api.messages.listRealtime, () => ({}));
      tasks = useQuery(api.tasks.list, () => ({}));
      events = useQuery(api.events.getRecent, () => ({ limit: 5 }));
    } catch (error) {
      console.error('Failed to initialize Convex:', error);
      convexAvailable = false;

      // Provide demo data when Convex is not available
      messages = {
        isLoading: false,
        data: [
          { _id: 'demo-1', author: 'Demo User', body: 'Welcome to the Convex + SvelteKit demo!', timestamp: Date.now() - 60000 },
          { _id: 'demo-2', author: 'System', body: 'Connect your Convex backend to see real-time updates.', timestamp: Date.now() - 30000 }
        ],
        error: null
      };

      tasks = {
        isLoading: false,
        data: [
          { _id: 'demo-task-1', title: 'Set up Convex backend', completed: false, createdAt: Date.now() - 120000 },
          { _id: 'demo-task-2', title: 'Configure environment variables', completed: true, createdAt: Date.now() - 90000 }
        ],
        error: null
      };

      events = {
        isLoading: false,
        data: [
          { _id: 'demo-event-1', type: 'demo', timestamp: Date.now(), data: { message: 'Demo mode active' } }
        ],
        error: null
      };
    }
  }

  let newMessage = '';
  let newTask = '';
  let author = 'Demo User';

  async function sendMessage() {
    if (!newMessage.trim()) return;

    if (convexAvailable && client) {
      try {
        await client.mutation(api.messages.send, {
          author,
          body: newMessage.trim()
        });

        newMessage = '';
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    } else {
      // Demo mode - add message to local data
      const newMsg = {
        _id: 'demo-' + Date.now(),
        author,
        body: newMessage.trim(),
        timestamp: Date.now()
      };

      messages.data = [newMsg, ...messages.data];
      newMessage = '';
    }
  }

  async function createTask() {
    if (!newTask.trim()) return;

    if (convexAvailable && client) {
      try {
        await client.mutation(api.tasks.create, {
          title: newTask.trim()
        });

        newTask = '';
      } catch (error) {
        console.error('Failed to create task:', error);
      }
    } else {
      // Demo mode - add task to local data
      const newTaskItem = {
        _id: 'demo-task-' + Date.now(),
        title: newTask.trim(),
        completed: false,
        createdAt: Date.now()
      };

      tasks.data = [newTaskItem, ...tasks.data];
      newTask = '';
    }
  }

  function handleKeydown(event: KeyboardEvent, action: () => void) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      action();
    }
  }
</script>

<svelte:head>
  <title>Convex + SvelteKit 5 Demo</title>
  <meta name="description" content="Real-time demo with Convex, SvelteKit 5, TypeScript, and Tailwind CSS" />
</svelte:head>

<div class="container">
  <header class="text-center mb-8">
    <h1 class="text-4xl font-bold text-gray-900 mb-2">
      Convex + SvelteKit 5 Demo
    </h1>
    <p class="text-lg text-gray-600">
      Real-time messaging and task management with Server-Sent Events
    </p>

    {#if !convexAvailable}
      <div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
        <p class="font-medium mb-2">🚀 Demo Mode Active</p>
        <p>To enable real-time features, update your <code class="bg-blue-100 px-1 rounded">.env.local</code> file with your Convex URL:</p>
        <code class="block mt-2 bg-blue-100 p-2 rounded text-xs">PUBLIC_CONVEX_URL=https://your-convex-server.com</code>
      </div>
    {/if}
  </header>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <!-- Messages Section -->
    <div class="card">
      <h2 class="text-2xl font-semibold mb-4">Real-time Messages</h2>

      <!-- Message Input -->
      <div class="mb-4 space-y-2">
        <input
          type="text"
          bind:value={author}
          placeholder="Your name"
          class="input"
        />
        <div class="flex gap-2">
          <input
            type="text"
            bind:value={newMessage}
            placeholder="Type a message..."
            class="input flex-1"
            on:keydown={(e) => handleKeydown(e, sendMessage)}
          />
          <button
            on:click={sendMessage}
            disabled={!newMessage.trim()}
            class="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>

      <!-- Messages List -->
      <MessageList {messages} />
    </div>

    <!-- Tasks Section -->
    <div class="card">
      <h2 class="text-2xl font-semibold mb-4">Task Management</h2>

      <!-- Task Input -->
      <div class="mb-4">
        <div class="flex gap-2">
          <input
            type="text"
            bind:value={newTask}
            placeholder="Add a new task..."
            class="input flex-1"
            on:keydown={(e) => handleKeydown(e, createTask)}
          />
          <button
            on:click={createTask}
            disabled={!newTask.trim()}
            class="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </div>

      <!-- Tasks List -->
      <TaskList {tasks} />
    </div>
  </div>

  <!-- Event Stream Section -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
    <div class="card">
      <h2 class="text-2xl font-semibold mb-4">Recent Events (Convex Query)</h2>
      <EventStream {events} />
    </div>

    <div class="card">
      <SSEEventStream />
    </div>
  </div>

  <!-- Connection Status -->
  <div class="mt-8 text-center">
    {#if convexAvailable && client}
      <div class="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
        <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        Connected to Convex
      </div>
    {:else}
      <div class="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
        <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
        Demo Mode - Configure Convex to enable real-time features
      </div>
    {/if}
  </div>
</div>
