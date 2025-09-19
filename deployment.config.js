/**
 * Deployment Configuration for Convex + SvelteKit + Cloudflare Workers
 * 
 * This file contains environment-specific configurations for deployment.
 * You can override these settings using environment variables.
 */

export const deploymentConfig = {
  // Local Development Environment
  local: {
    name: 'Local Development',
    convex: {
      url: process.env.LOCAL_CONVEX_URL || 'http://localhost:3210',
      adminKey: process.env.LOCAL_CONVEX_ADMIN_KEY || '',
      autoStart: true,
      watchMode: true
    },
    cloudflare: {
      enabled: false,
      environment: '',
      accountId: process.env.CLOUDFLARE_ACCOUNT_ID || ''
    },
    build: {
      skipBuild: true,
      watchMode: true
    }
  },

  // Staging Environment
  staging: {
    name: 'Staging',
    convex: {
      url: process.env.STAGING_CONVEX_URL || '',
      adminKey: process.env.STAGING_CONVEX_ADMIN_KEY || '',
      autoStart: false,
      watchMode: false
    },
    cloudflare: {
      enabled: true,
      environment: 'staging',
      accountId: process.env.CLOUDFLARE_ACCOUNT_ID || 'cf535d76fffdb44d43f6a3c00a3ebbe6'
    },
    build: {
      skipBuild: false,
      watchMode: false
    }
  },

  // Production Environment
  production: {
    name: 'Production',
    convex: {
      url: process.env.PROD_CONVEX_URL || 'https://backend-ew0s84sgw8wswwso8gsg8gg8.rcdc.me',
      adminKey: process.env.PROD_CONVEX_ADMIN_KEY || 'self-hosted-convex|01cb8fac9fa020cafc17e43649a768856b7ebbdddddd9a1d775e48b61072e993d8562a529cec49948d9abe5c046715725a',
      autoStart: false,
      watchMode: false
    },
    cloudflare: {
      enabled: true,
      environment: 'production',
      accountId: process.env.CLOUDFLARE_ACCOUNT_ID || 'cf535d76fffdb44d43f6a3c00a3ebbe6'
    },
    build: {
      skipBuild: false,
      watchMode: false
    }
  }
};

// Validation rules for each environment
export const validationRules = {
  convex: {
    url: {
      required: true,
      pattern: /^https?:\/\/.+/,
      message: 'Convex URL must be a valid HTTP/HTTPS URL'
    },
    adminKey: {
      required: true,
      pattern: /^self-hosted-convex\|.+/,
      message: 'Admin key must start with "self-hosted-convex|"'
    }
  },
  cloudflare: {
    accountId: {
      required: true,
      pattern: /^[a-f0-9]{32}$/,
      message: 'Account ID must be a 32-character hexadecimal string'
    }
  }
};

// Default deployment steps for each environment
export const deploymentSteps = {
  local: [
    'validate-config',
    'update-env-file',
    'start-convex-dev'
  ],
  staging: [
    'validate-config',
    'update-env-file',
    'deploy-convex',
    'build-app',
    'deploy-cloudflare',
    'verify-deployment'
  ],
  production: [
    'validate-config',
    'update-env-file',
    'deploy-convex',
    'build-app',
    'deploy-cloudflare',
    'verify-deployment',
    'notify-completion'
  ]
};

export default deploymentConfig;
