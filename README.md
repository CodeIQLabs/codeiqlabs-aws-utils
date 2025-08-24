# @codeiqlabs/aws-utils

**Standardized AWS utilities for enterprise projects** - A comprehensive TypeScript library
providing resource naming, configuration validation, environment management, and tagging utilities
for consistent AWS infrastructure deployment across any organization's projects.

## 🚀 Key Features

- **🧠 IntelliSense Setup**: Automated IDE configuration for manifest files with autocomplete,
  validation, and documentation
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

**📦 Includes CLI Tools**: The package includes command-line tools for IntelliSense setup and other
utilities. After installation, you can use `npx @codeiqlabs/aws-utils --help` to see available
commands.

## 🧠 IntelliSense Setup for Manifest Files

Get **autocomplete, validation, and hover documentation** for your manifest.yaml files in both VS
Code and IntelliJ IDEA with zero configuration!

### 🚀 Quick Setup

```bash
# 1. Install the package
npm install @codeiqlabs/aws-utils

# 2. Set up IntelliSense (one command!)
npx @codeiqlabs/aws-utils setup-intellisense

# 3. Restart your editor and enjoy full IntelliSense support!
```

### ✨ What You Get

- **🔍 Autocomplete**: Smart suggestions for all manifest properties
- **⚡ Real-time Validation**: Instant error highlighting and detailed messages
- **📖 Hover Documentation**: Comprehensive field descriptions and examples
- **🎯 Contextual Suggestions**: Properties appear in the correct YAML hierarchy
- **🔄 Always Up-to-date**: Schemas automatically sync with package updates

### 🎛️ CLI Options

```bash
# Auto-detect and set up all manifest files
npx @codeiqlabs/aws-utils setup-intellisense

# Set up specific manifest file
npx @codeiqlabs/aws-utils setup-intellisense --manifest=src/manifest.yaml

# Force specific manifest type
npx @codeiqlabs/aws-utils setup-intellisense --type=management

# Quiet mode (minimal output)
npx @codeiqlabs/aws-utils setup-intellisense --auto --quiet

# Show help
npx @codeiqlabs/aws-utils setup-intellisense --help
```

### 📝 Manual Schema Reference (Alternative)

If you prefer to add the schema reference manually, add this line to the top of your
`manifest.yaml`:

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/CodeIQLabs/codeiqlabs-aws-utils/main/schemas/management-manifest.schema.json

project: 'MyProject'
company: 'MyOrganization'
# ... rest of your manifest
```

**Available Schema URLs:**

- **Management**:
  `https://raw.githubusercontent.com/CodeIQLabs/codeiqlabs-aws-utils/main/schemas/management-manifest.schema.json`
- **Workload**:
  `https://raw.githubusercontent.com/CodeIQLabs/codeiqlabs-aws-utils/main/schemas/workload-manifest.schema.json`
- **Shared Services**:
  `https://raw.githubusercontent.com/CodeIQLabs/codeiqlabs-aws-utils/main/schemas/shared-services-manifest.schema.json`

### 🔧 Editor Support

#### VS Code

- Requires **YAML extension by Red Hat**
- Automatic configuration via `.vscode/settings.json`
- Works with both local and HTTP schema references

#### IntelliJ IDEA

- Built-in YAML support with JSON Schema
- Automatic configuration via `.idea/jsonSchemas.xml`
- HTTP schema URLs provide the most reliable experience

### 🎯 Supported Manifest Types

The CLI automatically detects your manifest type based on content:

- **Management**: Contains `organization:` and `identityCenter:` sections
- **Workload**: Contains `deploymentPermissions:` or `environments:` sections
- **Shared Services**: Contains `sharedServices:` section

### 🌐 HTTP vs Local Schemas

**HTTP Schemas (Recommended):**

- ✅ Always up-to-date
- ✅ No local file management
- ✅ Works across all environments
- ✅ Most reliable in IntelliJ IDEA
- ⚠️ Requires internet connection

**Local Schemas (Fallback):**

- ✅ Works offline
- ✅ Faster loading
- ⚠️ Manual updates required
- ⚠️ Path resolution issues in some IDEs

### 🔍 Troubleshooting

**IntelliSense not working?**

1. **Restart your editor** after running the setup
2. **Check the status bar** - should show schema detection
3. **Verify YAML extension** is installed (VS Code)
4. **Try manual schema reference** if auto-setup fails
5. **Check internet connection** for HTTP schemas

**Still having issues?**

- Run with verbose output: `npx @codeiqlabs/aws-utils setup-intellisense --verbose`
- Check the [GitHub Issues](https://github.com/CodeIQLabs/codeiqlabs-aws-utils/issues) for known
  problems

### 📋 Example: Management Manifest with IntelliSense

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/CodeIQLabs/codeiqlabs-aws-utils/main/schemas/management-manifest.schema.json

project: 'MyOrganization' # ✅ Autocomplete suggests valid project names
company: 'MyOrganization' # ✅ Validation ensures required field
type: 'management' # ✅ Enum validation for manifest types

management: # ✅ Contextual autocomplete for nested properties
  accountId: '123456789012' # ✅ Pattern validation for 12-digit AWS account ID
  region: 'us-east-1' # ✅ AWS region format validation
  environment: 'mgmt' # ✅ Enum validation for environment values

organization: # ✅ Hover shows detailed documentation
  enabled: true # ✅ Boolean validation
  rootId: 'r-abc123' # ✅ Organization root ID pattern validation
  mode: 'adopt' # ✅ Enum: "create" or "adopt"

  organizationalUnits: # ✅ Array validation with item schemas
    - key: 'production' # ✅ Key format validation
      name: 'Production' # ✅ Required field validation
      accounts: # ✅ Nested array validation
        - key: 'prod-account' # ✅ Account key validation
          name: 'Production Account'
          email: 'aws+prod@company.com' # ✅ Email format validation
          environment: 'prod' # ✅ Environment enum validation
          purpose: 'Production workloads'

identityCenter: # ✅ Complex object validation
  enabled: true
  instanceArn: 'arn:aws:sso:::instance/ssoins-abc123' # ✅ ARN format validation
  permissionSets: # ✅ Array of permission set objects
    - name: 'ReadOnlyAccess' # ✅ Required field validation
      description: 'Read-only access to AWS resources'
      sessionDuration: 'PT8H' # ✅ ISO 8601 duration format validation
```

**IntelliSense Features in Action:**

- 🔍 **Type `org`** → Suggests `organization:`
- 🔍 **Inside `management:`** → Suggests `accountId:`, `region:`, `environment:`
- ⚡ **Invalid values** → Red underlines with error messages
- 📖 **Hover over properties** → Shows descriptions and examples
- 🎯 **Contextual suggestions** → Only relevant properties for each section

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
