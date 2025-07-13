# Convex + SvelteKit 5 Demo

A real-time demo application built with SvelteKit 5, TypeScript, Tailwind CSS, and Convex (self-hosted). Features real-time messaging, task management, and Server-Sent Events (SSE).

## Features

- 🚀 **SvelteKit 5** with TypeScript
- 🎨 **Tailwind CSS** for styling
- 🔄 **Real-time updates** with Convex queries
- 📡 **Server-Sent Events (SSE)** for live event streaming
- 💬 **Real-time messaging** system
- ✅ **Task management** with live updates
- 📊 **Event tracking** and display

## Prerequisites

- Node.js 20.16+
- Self-hosted Convex instance running

## Setup Instructions

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and set your self-hosted Convex URL:
   ```
   PUBLIC_CONVEX_URL=http://your-convex-server:8080
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173`

## Convex Setup (Self-hosted)

✅ **Convex is already configured and running!**

The demo includes:
- **Schema**: Messages, tasks, and events tables
- **Functions**: Queries and mutations for real-time operations
- **Real-time subscriptions**: Live updates via Convex queries
- **SSE endpoint**: Additional real-time events via Server-Sent Events

Your Convex functions are deployed and ready to use.

## Project Structure

```
src/
├── lib/
│   ├── components/          # Svelte components
│   │   ├── MessageList.svelte
│   │   ├── TaskList.svelte
│   │   ├── EventStream.svelte
│   │   └── SSEEventStream.svelte
│   └── convex.ts           # Convex client setup
├── routes/
│   ├── api/events/         # SSE endpoint
│   ├── +layout.svelte      # App layout
│   └── +page.svelte        # Main demo page
└── app.css                 # Tailwind styles

convex/
├── schema.ts               # Database schema
├── messages.ts             # Message functions
├── tasks.ts                # Task functions
├── events.ts               # Event functions
└── _generated/             # Generated Convex files
```

## Demo Features

### Real-time Messaging
- Send and receive messages instantly
- Delete messages with real-time updates
- Author names and timestamps

### Task Management
- Create, complete, and delete tasks
- Real-time status updates
- Task completion tracking

### Event Streaming
- **Convex Queries**: Real-time events via Convex subscriptions
- **Server-Sent Events**: Additional live event stream
- Event history and real-time notifications

## Building for Production

```bash
npm run build
npm run preview
```

## Technologies Used

- **SvelteKit 5**: Full-stack framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first styling
- **Convex**: Real-time backend (self-hosted)
- **Server-Sent Events**: Additional real-time capabilities

## Notes for Self-hosted Convex

- Ensure your Convex server is running and accessible
- Update the `PUBLIC_CONVEX_URL` in `.env.local` to match your server
- The demo works with both cloud and self-hosted Convex instances
- All Convex functions are included in the `convex/` directory
