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

## Deployment Management System

This project includes a comprehensive deployment management system that handles multiple environments and automates the deployment process.

### Quick Start

```bash
# Set up environment files (first time only)
npm run setup:env

# Deploy to production
npm run deploy:production

# Deploy to staging
npm run deploy:staging

# Deploy only Convex functions
npm run deploy:convex prod

# Check deployment status
npm run deploy:status prod
```

### Available Deployment Commands

| Command | Description |
|---------|-------------|
| `npm run setup:env` | Interactive environment setup |
| `npm run deploy:local` | Local development setup |
| `npm run deploy:staging` | Deploy to staging |
| `npm run deploy:production` | Deploy to production |
| `npm run deploy:convex [env]` | Deploy only Convex functions |
| `npm run deploy:cf [env]` | Deploy only to Cloudflare Workers |
| `npm run deploy:status [env]` | Show deployment status |

### Environment Configuration

The deployment system uses environment-specific configuration files:

- **`.env.local`** - Local development
- **`.env.staging`** - Staging environment
- **`.env.production`** - Production environment

### First Time Setup

1. **Run the environment setup:**
   ```bash
   npm run setup:env
   ```

2. **Choose your environment** (local/staging/production/all)

3. **Enter your Convex server details** when prompted

4. **Deploy:**
   ```bash
   npm run deploy:production
   ```

### Manual Deployment (Legacy)

You can still use the original deployment commands:

```bash
# Deploy to Cloudflare Workers
npm run deploy              # Default environment
npm run deploy:staging      # Staging environment
npm run deploy:production   # Production environment
```

For detailed deployment documentation, see [DEPLOYMENT.md](./DEPLOYMENT.md).

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
