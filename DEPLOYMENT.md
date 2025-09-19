# Deployment Management Guide

This guide explains how to use the deployment management system for your Convex + SvelteKit + Cloudflare Workers application.

## Quick Start

```bash
# Deploy to production (full deployment)
npm run deploy:production

# Deploy to staging
npm run deploy:staging

# Deploy only Convex functions to production
npm run deploy:convex prod

# Deploy only to Cloudflare Workers
npm run deploy:cf staging

# Check deployment status
npm run deploy:status prod
```

## Available Commands

### Full Environment Deployments

| Command | Description | Environment |
|---------|-------------|-------------|
| `npm run deploy:local` | Local development setup | Local |
| `npm run deploy:staging` | Deploy to staging | Staging |
| `npm run deploy:production` | Deploy to production | Production |

### Partial Deployments

| Command | Description |
|---------|-------------|
| `npm run deploy:convex [env]` | Deploy only Convex functions |
| `npm run deploy:cf [env]` | Deploy only to Cloudflare Workers |
| `npm run deploy:status [env]` | Show deployment status |



## Environment Configuration

### 1. Local Development

**File**: `.env.local`

```env
# Local Development Environment
CONVEX_SELF_HOSTED_URL='http://localhost:3210'
CONVEX_SELF_HOSTED_ADMIN_KEY='your-local-admin-key'
PUBLIC_CONVEX_URL=http://localhost:3210
NODE_ENV=development
```

**Usage**:
```bash
npm run deploy:local
```

This will:
- Start Convex dev server (`npx convex dev`)
- Skip Cloudflare deployment
- Enable watch mode for development

### 2. Staging Environment

**File**: `.env.staging`

```env
# Staging Environment
CONVEX_SELF_HOSTED_URL='https://your-staging-convex-server.com'
CONVEX_SELF_HOSTED_ADMIN_KEY='your-staging-admin-key'
PUBLIC_CONVEX_URL=https://your-staging-convex-server.com
NODE_ENV=staging
```

**Usage**:
```bash
npm run deploy:staging
```

This will:
- Deploy Convex functions to staging server
- Build SvelteKit application
- Deploy to Cloudflare Workers staging environment

### 3. Production Environment

**File**: `.env.production`

```env
# Production Environment
CONVEX_SELF_HOSTED_URL='https://backend-ew0s84sgw8wswwso8gsg8gg8.rcdc.me'
CONVEX_SELF_HOSTED_ADMIN_KEY='self-hosted-convex|01cb8fac...'
PUBLIC_CONVEX_URL=https://backend-ew0s84sgw8wswwso8gsg8gg8.rcdc.me
NODE_ENV=production
```

**Usage**:
```bash
npm run deploy:production
```

This will:
- Deploy Convex functions to production server
- Build SvelteKit application for production
- Deploy to Cloudflare Workers production environment

## Advanced Usage

### Environment Variables Override

You can override configuration using environment variables:

```bash
# Override production Convex URL
PROD_CONVEX_URL="https://new-server.com" npm run deploy:production

# Override staging admin key
STAGING_CONVEX_ADMIN_KEY="new-key" npm run deploy:staging
```

### Deployment Flags

```bash
# Skip Convex deployment
npm run deploy:production -- --skip-convex

# Skip Cloudflare deployment
npm run deploy:production -- --skip-cf

# Deploy only specific parts
npm run deploy:convex prod
npm run deploy:cf staging
```

### Manual Script Usage

You can also run the deployment script directly:

```bash
# Full deployment to production
node scripts/deploy.js prod

# Deploy only Convex functions to staging
node scripts/deploy.js convex staging

# Show help
node scripts/deploy.js --help
```

## Troubleshooting

### Common Issues

1. **"Invalid environment" error**
   ```bash
   # Make sure you're using the correct environment name
   npm run deploy:production  # ✅ Correct
   npm run deploy:prod  # ❌ Wrong (use deploy:production)
   ```

2. **"Missing CONVEX_URL" error**
   - Check your `.env.{environment}` file
   - Ensure the URL is properly formatted
   - Verify environment variables are set

3. **Cloudflare authentication error**
   ```bash
   # Re-authenticate with Cloudflare
   npx wrangler logout
   npx wrangler login
   ```

4. **Convex deployment fails**
   - Verify your admin key is correct
   - Check if the Convex server is accessible
   - Ensure your functions are valid

### Debug Mode

Enable verbose logging:

```bash
DEBUG=1 npm run deploy:production
```

### Checking Deployment Status

```bash
# Check current deployment status
npm run deploy:status prod

# View Cloudflare Workers logs
npm run cf:tail

# Test Convex connection
curl -X POST "https://your-convex-server.com/api/query" \
  -H "Content-Type: application/json" \
  -H "Authorization: Convex your-admin-key" \
  -d '{"path": "messages:listRealtime", "args": {}}'
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - run: npm install

      - name: Deploy to Production
        env:
          PROD_CONVEX_URL: ${{ secrets.PROD_CONVEX_URL }}
          PROD_CONVEX_ADMIN_KEY: ${{ secrets.PROD_CONVEX_ADMIN_KEY }}
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
        run: npm run deploy:production
```

### Environment Secrets

Set these secrets in your CI/CD system:

- `PROD_CONVEX_URL`
- `PROD_CONVEX_ADMIN_KEY`
- `STAGING_CONVEX_URL`
- `STAGING_CONVEX_ADMIN_KEY`
- `CLOUDFLARE_API_TOKEN`

## File Structure

```
├── scripts/
│   └── deploy.js              # Main deployment script
├── .env.local                 # Local development config
├── .env.staging               # Staging environment config
├── .env.production            # Production environment config
├── deployment.config.js       # Deployment configuration
├── DEPLOYMENT.md              # This documentation
└── wrangler.toml              # Cloudflare Workers config
```

## Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review your environment configuration files
3. Verify your Convex server is accessible
4. Check Cloudflare Workers dashboard for deployment status
