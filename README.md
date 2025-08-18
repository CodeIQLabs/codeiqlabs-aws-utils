# @codeiqlabs/aws-utils

**Standardized AWS utilities for enterprise projects** - A comprehensive TypeScript library
providing resource naming, configuration validation, environment management, and tagging utilities
for consistent AWS infrastructure deployment across any organization's projects.

## 🚀 Key Features

- **🏷️ Resource Naming**: Consistent naming patterns across all AWS resources with automatic
  validation
- **📋 Configuration Validation**: Comprehensive Zod schemas for validating YAML configuration files
- **🌍 Environment Management**: Standardized environment handling (nprd, prod, mgmt, shared, pprd)
- **🏷️ Tagging Utilities**: Automated tagging for compliance and resource management
- **🔧 Helper Functions**: Common utilities for environment variables, validation, and AWS
  operations
- **📦 Dual Module Support**: Full ESM and CommonJS compatibility with modern tsup bundler

## 📦 Installation

```bash
# Using npm
npm install @codeiqlabs/aws-utils

# Using yarn
yarn add @codeiqlabs/aws-utils

# Using pnpm
pnpm add @codeiqlabs/aws-utils
```

## 🛠️ Build System

This package uses **tsup** for modern dual ESM/CJS publishing:

- **Fast builds** with automatic optimization and tree-shaking
- **Source maps** for better debugging experience
- **Type definitions** automatically generated for both ESM and CJS
- **Modern bundler approach** following TypeScript library best practices

## 📚 Usage Examples

### Resource Naming

Create consistent AWS resource names across all projects:

```typescript
import { ResourceNaming } from '@codeiqlabs/aws-utils';

const naming = new ResourceNaming({
  project: 'MyProject',
  environment: 'nprd',
});

// Generate standardized names
const stackName = naming.stackName('DeploymentPermissions');
// Result: "MyProject-NonProd-DeploymentPermissions-Stack"

const bucketName = naming.resourceName('artifacts');
// Result: "myproject-nprd-artifacts"

const parameterName = naming.parameterName('database-url');
// Result: "/MyProject/nprd/database-url"
```

### Environment Management

Standardized environment handling with validation:

```typescript
import { ENV_VALUES, validateEnvironment, getAccountIdFromEnv } from '@codeiqlabs/aws-utils';

// Validate environment values
const environment = validateEnvironment('nprd'); // ✅ Valid
// validateEnvironment('invalid'); // ❌ Throws error

// Get account IDs from environment variables
const accountId = getAccountIdFromEnv('MYPROJECT_NP_ACCOUNT', 'MyProject NonProd');

// Available environment constants
console.log(ENV_VALUES); // ['nprd', 'prod', 'mgmt', 'shared', 'pprd']
```

### Configuration Validation

Validate YAML configurations with comprehensive Zod schemas:

```typescript
import {
  loadManagementManifest,
  loadWorkloadManifest,
  validateConfig,
} from '@codeiqlabs/aws-utils';

// Load and validate management account configuration
const managementConfig = await loadManagementManifest('./config/management.yaml');

// Load and validate workload account configuration
const workloadConfig = await loadWorkloadManifest('./config/workload.yaml');

// Manual validation with specific schemas
import type { ProjectEnvironment, DeploymentPermissions } from '@codeiqlabs/aws-utils';

const projectEnv: ProjectEnvironment = {
  name: 'MyProject',
  environments: ['nprd', 'prod'],
  github: {
    organization: 'MyOrganization',
    repository: 'myproject-infrastructure',
  },
};
```

### Tagging Utilities

Automated tagging for compliance and resource management:

```typescript
import { applyStandardTags } from '@codeiqlabs/aws-utils';

// Apply standardized tags to CDK constructs
applyStandardTags(stack, {
  project: 'MyProject',
  environment: 'nprd',
  component: 'API',
  owner: 'Platform Team',
  company: 'MyOrganization',
  extraTags: {
    CostCenter: 'Engineering',
  },
});
```

## 🏗️ Module Formats

This package supports both ESM and CommonJS with automatic dual publishing:

### ESM (Recommended)

```typescript
import {
  ResourceNaming,
  ENV_VALUES,
  validateEnvironment,
  loadManagementManifest,
} from '@codeiqlabs/aws-utils';
```

### CommonJS

```javascript
const {
  ResourceNaming,
  ENV_VALUES,
  validateEnvironment,
  loadManagementManifest,
} = require('@codeiqlabs/aws-utils');
```

## 🔧 Development

### Prerequisites

- Node.js 18+
- npm 9+
- TypeScript 5+

### Setup

```bash
# Clone the repository
git clone https://github.com/CodeIQLabs/codeiqlabs-aws-utils.git
cd codeiqlabs-aws-utils

# Install dependencies
npm install

# Build the package (dual ESM/CJS with tsup)
npm run build

# Run tests
npm run test:all

# Lint and format
npm run lint
npm run format
```

### Build Commands

```bash
# Clean build artifacts
npm run clean

# Build with tsup (ESM + CJS + types + source maps)
npm run build:bundle

# Full build pipeline (clean + bundle + lint)
npm run build

# Development watch mode
npm run dev
```

## 🧪 Testing

```bash
# Run all tests (CJS + ESM import tests)
npm run test:all

# Run individual test suites
npm run test:load    # Configuration loading tests
npm run test:esm     # ESM import tests
```

## 📋 Configuration Schemas

The package provides comprehensive Zod schemas organized by AWS service alignment:

### Available Types

```typescript
// Core types exported from main package
import type {
  // Environment & Project types
  Environment,
  ProjectEnvironment,
  Project,

  // AWS Resource types
  DeploymentPermissions,
  CrossAccountRole,
  GitHubOidc,
  PermissionSetConfig,
  SSOAssignmentConfig,
  OrganizationalUnitConfig,
  AccountConfig,

  // Naming types
  NamingConfig,
  BaseParamOpts,
  StringParamOpts,
  BatchParamOpts,
} from '@codeiqlabs/aws-utils';
```

## 🔄 Integration with @codeiqlabs/eslint-prettier-config

This package uses the centralized ESLint and Prettier configuration:

```json
{
  "devDependencies": {
    "@codeiqlabs/eslint-prettier-config": "^1.5.0"
  }
}
```

The v1.5.0 release includes:

- **Modular architecture** with proper separation of concerns
- **ESLint 9.x compatibility** with updated React plugin versions
- **Zero dependency conflicts** with the new bundler approach
- **Enhanced TypeScript rules** and better error handling

## 🚀 Release Process

This package uses automated release management with changesets:

1. **Make changes** and create a changeset: `npm run changeset`
2. **Commit changes** with descriptive messages
3. **Create Pull Request** - CI validates builds and tests
4. **Merge PR** - Automated release workflow publishes to GitHub Packages

### Versioning

- **patch**: Bug fixes, documentation updates, internal refactoring
- **minor**: New features, new utilities, additive changes
- **major**: Breaking changes, removed features, changed APIs

## 📄 License

MIT - See [LICENSE](LICENSE) file for details.

---

**Part of the CodeIQLabs infrastructure ecosystem** - Standardizing AWS deployments across all
projects with consistent naming, validation, and management utilities.
