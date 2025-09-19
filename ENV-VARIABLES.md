# Environment Variables in wrangler.toml

This guide explains how to use environment variables in your `wrangler.toml` configuration file for dynamic deployments.

## Overview

Wrangler supports environment variable substitution using the `${VARIABLE_NAME}` syntax. This allows you to:

- Keep sensitive data out of your repository
- Use the same configuration file for multiple environments
- Dynamically configure deployments based on CI/CD context

## Basic Syntax

```toml
# Basic substitution
name = "${PROJECT_NAME}"

# With fallback/default value
name = "${PROJECT_NAME:-my-default-project}"

# In variables section
[vars]
API_URL = "${API_URL}"
DEBUG = "${DEBUG:-false}"
```

## Current Implementation

Your `wrangler.toml` now uses environment variables:

```toml
# Default environment variables (using env vars)
[vars]
CONVEX_SELF_HOSTED_URL = "${CONVEX_SELF_HOSTED_URL}"
PUBLIC_CONVEX_URL = "${PUBLIC_CONVEX_URL}"
CONVEX_SELF_HOSTED_ADMIN_KEY = "${CONVEX_SELF_HOSTED_ADMIN_KEY}"

# Environment-specific configurations
[env.production.vars]
CONVEX_SELF_HOSTED_URL = "${PROD_CONVEX_URL}"
PUBLIC_CONVEX_URL = "${PROD_CONVEX_URL}"
CONVEX_SELF_HOSTED_ADMIN_KEY = "${PROD_CONVEX_ADMIN_KEY}"

[env.staging.vars]
CONVEX_SELF_HOSTED_URL = "${STAGING_CONVEX_URL}"
PUBLIC_CONVEX_URL = "${STAGING_CONVEX_URL}"
CONVEX_SELF_HOSTED_ADMIN_KEY = "${STAGING_CONVEX_ADMIN_KEY}"
```

## Usage Methods

### 1. **Command Line Environment Variables**

Set variables when running wrangler commands:

```bash
# Single deployment
PROD_CONVEX_URL="https://your-server.com" \
PROD_CONVEX_ADMIN_KEY="your-key" \
npx wrangler deploy --env production

# Multiple variables
export PROD_CONVEX_URL="https://your-server.com"
export PROD_CONVEX_ADMIN_KEY="your-key"
npx wrangler deploy --env production
```

### 2. **Using .env Files**

Create environment-specific `.env` files:

**`.env.production`**:
```env
PROD_CONVEX_URL=https://your-production-server.com
PROD_CONVEX_ADMIN_KEY=your-production-key
```

**`.env.staging`**:
```env
STAGING_CONVEX_URL=https://your-staging-server.com
STAGING_CONVEX_ADMIN_KEY=your-staging-key
```

Then load them before deployment:
```bash
# Load production environment
source .env.production
npx wrangler deploy --env production

# Or use a tool like dotenv
npx dotenv -e .env.production -- wrangler deploy --env production
```

### 3. **CI/CD Integration**

Set environment variables in your CI/CD system:

**GitHub Actions**:
```yaml
- name: Deploy to Production
  env:
    PROD_CONVEX_URL: ${{ secrets.PROD_CONVEX_URL }}
    PROD_CONVEX_ADMIN_KEY: ${{ secrets.PROD_CONVEX_ADMIN_KEY }}
  run: npx wrangler deploy --env production
```

**GitLab CI**:
```yaml
deploy:production:
  variables:
    PROD_CONVEX_URL: $PROD_CONVEX_URL
    PROD_CONVEX_ADMIN_KEY: $PROD_CONVEX_ADMIN_KEY
  script:
    - npx wrangler deploy --env production
```

### 4. **Using the Deployment Script**

Our deployment script automatically handles environment variables:

```bash
# The script reads from .env files and sets variables
npm run deploy:prod

# Or override with environment variables
PROD_CONVEX_URL="https://new-server.com" npm run deploy:prod
```

## Advanced Patterns

### **Fallback Values**

Use fallback values for optional configuration:

```toml
[vars]
DEBUG = "${DEBUG:-false}"
LOG_LEVEL = "${LOG_LEVEL:-info}"
TIMEOUT = "${TIMEOUT:-30000}"
```

### **Environment-Specific Overrides**

Different values per environment:

```toml
[vars]
# Default values
API_URL = "${API_URL:-http://localhost:3000}"

[env.staging.vars]
# Staging overrides
API_URL = "${STAGING_API_URL:-https://staging-api.example.com}"

[env.production.vars]
# Production overrides
API_URL = "${PROD_API_URL:-https://api.example.com}"
```

### **Dynamic Project Names**

Use environment variables for project naming:

```toml
name = "${PROJECT_NAME:-my-project}-${ENVIRONMENT:-dev}"
```

## Important Notes

### **NODE_ENV Handling**

⚠️ **Vite manages NODE_ENV automatically** - don't set it in `.env` files:

❌ **Don't do this**:
```env
NODE_ENV=production  # Vite will show a warning
```

✅ **Vite handles this automatically**:
- `NODE_ENV=development` during `vite dev`
- `NODE_ENV=production` during `vite build`

If you see this warning:
```
NODE_ENV=production is not supported in the .env file. Only NODE_ENV=development is supported to create a development build of your project.
```

Simply remove `NODE_ENV` from your `.env` files.

## Security Best Practices

### **1. Never Commit Secrets**

❌ **Don't do this**:
```toml
[vars]
API_KEY = "secret-key-123"  # Never hardcode secrets!
```

✅ **Do this instead**:
```toml
[vars]
API_KEY = "${API_KEY}"  # Use environment variable
```

### **2. Use Wrangler Secrets for Sensitive Data**

For highly sensitive data, use Wrangler's secret management:

```bash
# Set a secret (not visible in wrangler.toml)
npx wrangler secret put CONVEX_ADMIN_KEY

# Reference in your Worker code
export default {
  async fetch(request, env) {
    const adminKey = env.CONVEX_ADMIN_KEY;
    // Use the secret
  }
}
```

### **3. Environment File Security**

- Add `.env.*` files to `.gitignore`
- Use different keys for different environments
- Rotate keys regularly

## Troubleshooting

### **Variable Not Substituted**

If variables aren't being substituted:

1. **Check syntax**: Use `${VAR_NAME}`, not `$VAR_NAME`
2. **Verify variable is set**: `echo $PROD_CONVEX_URL`
3. **Check environment**: Make sure you're using the right environment

### **Empty Values**

If variables are empty:

```bash
# Debug: Check what wrangler sees
npx wrangler deploy --dry-run --env production

# Check environment variables
env | grep CONVEX
```

### **Deployment Script Issues**

If the deployment script isn't working:

```bash
# Run with debug output
DEBUG=1 npm run deploy:prod

# Check the generated command
node scripts/deploy.js prod --dry-run
```

## Examples

### **Complete Deployment Workflow**

```bash
# 1. Set up environment file
cat > .env.production << EOF
PROD_CONVEX_URL=https://backend-xyz.example.com
PROD_CONVEX_ADMIN_KEY=self-hosted-convex|abc123...
EOF

# 2. Deploy using our script (automatically loads .env.production)
npm run deploy:prod

# 3. Or deploy manually
source .env.production
npx wrangler deploy --env production
```

### **Multi-Environment Setup**

```bash
# Set up all environments
npm run setup:env

# Deploy to staging
npm run deploy:stage

# Deploy to production
npm run deploy:prod

# Check status
npm run deploy:status prod
```

This environment variable system provides flexibility while maintaining security and ease of use across different deployment scenarios.
