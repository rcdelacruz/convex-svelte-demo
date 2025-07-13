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

### Running Self-hosted Convex

1. **Start the Convex development server:**
   ```bash
   npx convex dev
   ```

   This command will:
   - Start the local Convex backend server
   - Watch for changes in your `convex/` directory
   - Automatically deploy function updates
   - Generate TypeScript types in `convex/_generated/`

2. **Configure your environment:**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your self-hosted Convex server details:
   ```env
   # Convex Configuration
   # Replace with your actual self-hosted Convex URL
   CONVEX_SELF_HOSTED_URL='https://your-convex-server.com'
   CONVEX_SELF_HOSTED_ADMIN_KEY='your-admin-key-here'

   # Optional: Convex Deploy Key (for CI/CD)
   # CONVEX_DEPLOY_KEY=your-deploy-key-here

   PUBLIC_CONVEX_URL=https://your-convex-server.com
   ```

3. **Deploy your functions:**
   The `npx convex dev` command automatically deploys your functions, but you can also manually deploy:
   ```bash
   npx convex deploy
   ```

### What's Included

The demo includes:
- **Schema**: Messages, tasks, and events tables (`convex/schema.ts`)
- **Functions**: Queries and mutations for real-time operations
- **Real-time subscriptions**: Live updates via Convex queries
- **SSE endpoint**: Additional real-time events via Server-Sent Events

### First Time Setup

If this is your first time running the project:

1. Install dependencies: `npm install`
2. Start Convex: `npx convex dev`
3. Configure environment: Copy `.env.example` to `.env.local`
4. Start SvelteKit: `npm run dev`
5. Open browser: `http://localhost:5173`

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

## Deploying to Cloudflare Workers

### Prerequisites

1. **Cloudflare account** with Workers enabled
2. **Wrangler CLI** authenticated:
   ```bash
   npx wrangler login
   ```

### Deployment Steps

1. **Configure your environment variables:**

   Set your Convex secrets using Wrangler:
   ```bash
   # Set your Convex admin key (required)
   npx wrangler secret put CONVEX_SELF_HOSTED_ADMIN_KEY

   # Optional: Set deploy key for CI/CD
   npx wrangler secret put CONVEX_DEPLOY_KEY
   ```

2. **Update wrangler.toml:**

   Edit the environment variables in `wrangler.toml`:
   ```toml
   [env.production.vars]
   CONVEX_SELF_HOSTED_URL = "https://your-production-convex-server.com"
   PUBLIC_CONVEX_URL = "https://your-production-convex-server.com"
   ```

3. **Deploy to Cloudflare Workers:**
   ```bash
   # Deploy to default environment
   npm run deploy

   # Deploy to staging
   npm run deploy:staging

   # Deploy to production
   npm run deploy:production
   ```

4. **Test your deployment:**
   ```bash
   # View live logs
   npm run cf:tail

   # Test locally with Cloudflare Workers runtime
   npm run cf:dev
   ```

### Environment Management

- **Development**: Use `.env.local` for local development
- **Staging**: Configure `[env.staging.vars]` in `wrangler.toml`
- **Production**: Configure `[env.production.vars]` in `wrangler.toml`
- **Secrets**: Use `wrangler secret put` for sensitive data

## Technologies Used

- **SvelteKit 5**: Full-stack framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first styling
- **Convex**: Real-time backend (self-hosted)
- **Server-Sent Events**: Additional real-time capabilities

## Troubleshooting

### Common Issues

1. **"Failed to connect to Convex"**
   - Ensure your self-hosted Convex server is running
   - Check that `CONVEX_SELF_HOSTED_URL` and `PUBLIC_CONVEX_URL` in `.env.local` match your Convex server
   - Verify `CONVEX_SELF_HOSTED_ADMIN_KEY` is correctly set

2. **Functions not updating**
   - Restart `npx convex dev`
   - Check the console for deployment errors
   - Ensure your `convex/` directory structure is correct

3. **Demo mode showing instead of real-time data**
   - Verify Convex server is accessible
   - Check browser console for connection errors
   - Confirm environment variables are loaded correctly

### Environment Configuration

Create `.env.local` in your project root:

```env
# Convex Configuration
# Replace with your actual self-hosted Convex URL
CONVEX_SELF_HOSTED_URL='https://your-convex-server.com'
CONVEX_SELF_HOSTED_ADMIN_KEY='your-admin-key-here'

# Optional: Convex Deploy Key (for CI/CD)
# CONVEX_DEPLOY_KEY=your-deploy-key-here

PUBLIC_CONVEX_URL=https://your-convex-server.com
```

### Development Workflow

1. Start Convex: `npx convex dev` (keep running)
2. Start SvelteKit: `npm run dev` (in another terminal)
3. Make changes to `convex/` files - they auto-deploy
4. Make changes to `src/` files - they auto-reload

### Notes for Self-hosted Convex

- The demo works with both cloud and self-hosted Convex instances
- All Convex functions are included in the `convex/` directory
- Functions auto-deploy when using `npx convex dev`
- TypeScript types are auto-generated in `convex/_generated/`
