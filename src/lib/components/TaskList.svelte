<script lang="ts">
  import { useConvexClient } from 'convex-svelte';
  import { api } from '../../../convex/_generated/api';
  import { browser } from '$app/environment';

  export let tasks: any;

  let client: any = null;

  if (browser) {
    try {
      client = useConvexClient();
    } catch (error) {
      console.error('Failed to get Convex client:', error);
    }
  }

  async function toggleTask(id: string) {
    if (client) {
      try {
        await client.mutation(api.tasks.toggle, { id });
      } catch (error) {
        console.error('Failed to toggle task:', error);
      }
    } else {
      // Demo mode - toggle in local data
      if (tasks.data) {
        tasks.data = tasks.data.map((task: any) =>
          task._id === id ? { ...task, completed: !task.completed } : task
        );
      }
    }
  }

  async function deleteTask(id: string) {
    if (client) {
      try {
        await client.mutation(api.tasks.remove, { id });
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    } else {
      // Demo mode - remove from local data
      if (tasks.data) {
        tasks.data = tasks.data.filter((task: any) => task._id !== id);
      }
    }
  }

  function formatTime(timestamp: number) {
    return new Date(timestamp).toLocaleDateString();
  }
</script>

<div class="space-y-2 max-h-96 overflow-y-auto">
  {#if tasks.isLoading}
    <div class="loading">
      <div class="space-y-2">
        {#each Array(3) as _}
          <div class="bg-gray-200 h-12 rounded animate-pulse"></div>
        {/each}
      </div>
    </div>
  {:else if tasks.error}
    <div class="text-red-600 p-4 bg-red-50 rounded-md">
      Error loading tasks: {tasks.error.toString()}
    </div>
  {:else if tasks.data && tasks.data.length > 0}
    {#each tasks.data as task (task._id)}
      <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
        <input
          type="checkbox"
          checked={task.completed}
          on:change={() => toggleTask(task._id)}
          class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
        <div class="flex-1">
          <h3 class="font-medium {task.completed ? 'line-through text-gray-500' : 'text-gray-900'}">
            {task.title}
          </h3>
          {#if task.description}
            <p class="text-sm text-gray-600 {task.completed ? 'line-through' : ''}">
              {task.description}
            </p>
          {/if}
          <p class="text-xs text-gray-400 mt-1">
            Created: {formatTime(task.createdAt)}
          </p>
        </div>
        <button
          on:click={() => deleteTask(task._id)}
          class="text-red-500 hover:text-red-700 p-1"
          title="Delete task"
          aria-label="Delete task"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </button>
      </div>
    {/each}
  {:else}
    <div class="text-center text-gray-500 py-8">
      <p>No tasks yet. Add your first task!</p>
    </div>
  {/if}
</div>
