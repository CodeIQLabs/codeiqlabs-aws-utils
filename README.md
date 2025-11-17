# @codeiqlabs/aws-utils

**Standardized AWS utilities for enterprise projects** - A comprehensive TypeScript library
providing resource naming, configuration validation, environment management, and tagging utilities
for consistent AWS infrastructure deployment across any organization's projects.

[![GitHub package version](https://img.shields.io/github/package-json/v/CodeIQLabs/codeiqlabs-aws-utils?label=version)](https://github.com/CodeIQLabs/codeiqlabs-aws-utils/packages)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node-18.0+-green.svg)](https://nodejs.org/)

## Key Features

- **IntelliSense Setup**: Automated IDE configuration for manifest files with autocomplete,
  validation, and documentation
- **Resource Naming**: Consistent naming patterns across all AWS resources with automatic validation
- **Configuration Validation**: Comprehensive Zod schemas for validating YAML configuration files
- **Environment Management**: Standardized environment handling (nprd, prod, mgmt, shared, pprd)
- **Tagging Utilities**: Automated tagging for compliance and resource management
- **Helper Functions**: Common utilities for environment variables, validation, and AWS operations
- **Dual Module Support**: Full ESM and CommonJS compatibility with modern tsup bundler

## Installation

```bash
# Using npm
npm install @codeiqlabs/aws-utils

# Using yarn
yarn add @codeiqlabs/aws-utils

# Using pnpm
pnpm add @codeiqlabs/aws-utils
```

**Includes CLI Tools**: The package includes command-line tools for IntelliSense setup and other
utilities. After installation, you can use `npx @codeiqlabs/aws-utils --help` to see available
commands.

## Package Relationship

This package (`@codeiqlabs/aws-utils`) provides **framework-agnostic utilities** for AWS
infrastructure projects:

- Configuration loading and validation
- Resource naming conventions
- Tag generation
- Environment management
- JSON Schema validation

For **CDK-specific functionality**, use `@codeiqlabs/aws-cdk` which builds on top of aws-utils:

- CDK construct integration
- Stack and stage management
- CDK-specific tagging functions (`applyStandardTags`)
- Automatic CDK application bootstrap

## Quick Start

### Recommended: Use with CDK Applications

```typescript
// For CDK applications, use the auto-detection factory from @codeiqlabs/aws-cdk
// This example shows how external clients typically consume aws-utils via aws-cdk
import { createAutoApp } from '@codeiqlabs/aws-cdk';

// Automatically loads manifest, detects type, and creates appropriate stages
createAutoApp().then((app) => app.synth());

// Or for specific manifest types with validation:
import { createManagementApp, createWorkloadApp } from '@codeiqlabs/aws-cdk';

// Management account infrastructure
createManagementApp().then((app) => app.synth());

// Workload account infrastructure
createWorkloadApp().then((app) => app.synth());
```

### Advanced: Direct Manifest Loading

```typescript
import { loadManifest } from '@codeiqlabs/aws-utils';

// Load and validate any manifest with auto-detection (unified schema)
const result = await loadManifest('./manifest.yaml');
if (result.success) {
  console.log(`Loaded ${result.type} manifest`);
  // result.data is UnifiedAppConfig with type-safe access
  console.log(`Project: ${result.data.project}`);
}
```

## IntelliSense Setup for Manifest Files

Get **autocomplete, validation, and hover documentation** for your manifest.yaml files in both VS
Code and IntelliJ IDEA with zero configuration!

### Quick Setup

```bash
# 1. Install the package
npm install @codeiqlabs/aws-utils

# 2. Set up IntelliSense (one command!)
npx @codeiqlabs/aws-utils setup-intellisense

# 3. Restart your editor and enjoy full IntelliSense support!
```

### What You Get

- **Autocomplete**: Smart suggestions for all manifest properties
- **Real-time Validation**: Instant error highlighting and detailed messages
- **Hover Documentation**: Comprehensive field descriptions and examples
- **Contextual Suggestions**: Properties appear in the correct YAML hierarchy
- **Always Up-to-date**: Schemas automatically sync with package updates

### CLI Options

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

## JSON Schema Integration

The aws-utils package provides comprehensive JSON schemas for manifest validation and IDE
integration. These schemas are hosted on GitHub and automatically updated with each package release.

### Available Schema URLs

All schemas are hosted at:
`https://raw.githubusercontent.com/CodeIQLabs/codeiqlabs-aws-utils/main/schemas/`

- **Unified Schema**: `manifest.schema.json` - Complete schema with discriminated unions for all
  manifest types
- **Management Account**: `management-manifest.schema.json` - Schema for management account
  manifests
- **Workload Account**: `workload-manifest.schema.json` - Schema for workload account manifests
- **Shared Services**: `shared-services-manifest.schema.json` - Schema for shared services manifests
- **Baseline**: `baseline-manifest.schema.json` - Schema for baseline account manifests

### IDE Configuration

#### VS Code Configuration

**Option 1: Automatic Setup (Recommended)**

```bash
npx @codeiqlabs/aws-utils setup-intellisense
```

**Option 2: Manual Configuration**

Add to your `.vscode/settings.json`:

```json
{
  "yaml.schemas": {
    "https://raw.githubusercontent.com/CodeIQLabs/codeiqlabs-aws-utils/main/schemas/manifest.schema.json": [
      "**/manifest.yaml",
      "**/manifest.yml"
    ]
  }
}
```

#### IntelliJ IDEA Configuration

**Option 1: Automatic Setup (Recommended)**

```bash
npx @codeiqlabs/aws-utils setup-intellisense
```

**Option 2: Manual Configuration**

1. Open **Settings** → **Languages & Frameworks** → **Schemas and DTDs** → **JSON Schema Mappings**
2. Click **+** to add a new mapping
3. Set **Schema file or URL**:
   `https://raw.githubusercontent.com/CodeIQLabs/codeiqlabs-aws-utils/main/schemas/manifest.schema.json`
4. Set **Schema version**: `JSON Schema version 7`
5. Add file pattern: `**/manifest.yaml` and `**/manifest.yml`

### Schema Validation Benefits

With proper schema integration, you get:

- **Real-time validation** as you type
- **Autocomplete suggestions** for all properties
- **Hover documentation** with field descriptions
- **Error highlighting** with detailed messages
- **Type checking** for values and formats
- **Enum validation** for predefined values

## Resource Naming and Tagging

The aws-utils package provides comprehensive utilities for consistent AWS resource naming and
tagging across all CodeIQLabs projects.

### ResourceNaming Class

The `ResourceNaming` class ensures consistent naming patterns across all AWS resources using the
format: `{project}-{environment}-{resourceName}`.

#### Basic Usage

```typescript
import { ResourceNaming } from '@codeiqlabs/aws-utils';

// Initialize with naming configuration object
const naming = new ResourceNaming({
  project: 'MyProject',
  environment: 'prod',
});

// Generate resource names using actual API methods
const bucketName = naming.s3BucketName('data-storage');
// Result: "myproject-prod-data-storage-abc123" (with stable suffix)

const roleName = naming.iamRoleName('api-handler');
// Result: "MyProject-prod-api-handler"

const resourceName = naming.resourceName('user-sessions');
// Result: "myproject-prod-user-sessions"
```

#### Available Naming Methods

```typescript
// Core naming methods (actual API)
naming.stackName('DeploymentPermissions'); // CDK stack names
naming.exportName('vpc-id'); // CloudFormation export names
naming.resourceName('database'); // Generic resource names
naming.iamRoleName('execution-role'); // IAM role names
naming.s3BucketName('artifacts'); // S3 bucket names (with stable suffix)
naming.s3BucketName('artifacts', false); // S3 bucket names (without suffix)
naming.domainName('example.com', 'api'); // Domain names with subdomains
naming.ssmParameterName('accounts', 'prod-id'); // SSM parameter names

// Tagging integration
naming.standardTags({
  owner: 'platform-team',
  company: 'MyOrganization',
}); // Generate standard tags

// Configuration access
naming.getConfig(); // Get current naming configuration
```

### Standard Tagging Utilities

The package provides utilities for generating consistent tags across all AWS resources.

**Note**: For CDK-specific tagging functions like `applyStandardTags()`, use the
`@codeiqlabs/aws-cdk` package which provides CDK construct integration.

#### Basic Tagging

```typescript
import { generateStandardTags } from '@codeiqlabs/aws-utils';

// Generate standard tags for AWS resources
const tags = generateStandardTags(
  { project: 'MyProject', environment: 'prod' }, // NamingConfig
  { owner: 'platform-team', company: 'MyOrganization' }, // TaggingOptions
);

// Result:
// {
//   App: 'MyProject',
//   Environment: 'prod',
//   Owner: 'platform-team',
//   Company: 'MyOrganization',
//   ManagedBy: 'aws-utils'
// }
```

## Repository Structure

```
codeiqlabs-aws-utils/
├── src/
│   ├── config/          # Configuration loading and validation
│   ├── naming/          # Resource naming utilities
│   ├── tagging/         # Tagging utilities
│   ├── environment/     # Environment management
│   └── schemas/         # Zod schemas for validation
├── schemas/             # JSON schemas for IDE integration
├── cli/                 # CLI tools (IntelliSense setup, etc.)
├── tests/               # ESM/CommonJS integration tests
├── dist/                # Build output (generated)
└── package.json
```

## Usage Patterns

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

const bucketName = naming.s3BucketName('artifacts');
// Result: "myproject-nprd-artifacts-abc123" (with stable suffix)

const resourceName = naming.resourceName('database');
// Result: "myproject-nprd-database"

const parameterName = naming.ssmParameterName('accounts', 'database-url');
// Result: "/MyProject/nprd/accounts/database-url"

const roleName = naming.iamRoleName('execution-role');
// Result: "MyProject-nprd-execution-role"
```

### Environment Management

Standardized environment handling with validation:

```typescript
import { ENV_VALUES, validateEnvironment, getAccountIdFromEnv } from '@codeiqlabs/aws-utils';

// Validate environment values
const environment = validateEnvironment('nprd'); // Valid
// validateEnvironment('invalid'); // Throws error

// Get account IDs from environment variables
const accountId = getAccountIdFromEnv('MYPROJECT_NP_ACCOUNT', 'MyProject NonProd');

// Available environment constants
console.log(ENV_VALUES); // ['nprd', 'prod', 'mgmt', 'shared', 'pprd']
```

### Configuration Validation

Validate YAML configurations with comprehensive Zod schemas:

```typescript
import { loadManifest } from '@codeiqlabs/aws-utils';

// Load and validate any manifest with auto-detection
const result = await loadManifest('./config/manifest.yaml');

if (result.success) {
  console.log(`Loaded ${result.type} manifest`);

  // Type-safe access based on detected type
  if (result.type === 'management') {
    // result.data is typed as ManagementAppConfig
    console.log(`Organization enabled: ${result.data.organization?.enabled}`);
  } else if (result.type === 'workload') {
    // result.data is typed as WorkloadAppConfig
    console.log(`Environments: ${Object.keys(result.data.environments || {})}`);
  }
} else {
  console.error(`Failed to load manifest: ${result.error}`);
}

// Manual validation with specific schemas
import { ManagementAppConfigSchema, WorkloadAppConfigSchema } from '@codeiqlabs/aws-utils/config';

// Validate specific manifest types
const managementConfig = ManagementAppConfigSchema.parse(yamlData);
const workloadConfig = WorkloadAppConfigSchema.parse(yamlData);
```

### Tagging Utilities

Automated tagging for compliance and resource management:

```typescript
import { generateStandardTags } from '@codeiqlabs/aws-utils';

// Generate standardized tags for AWS resources
const tags = generateStandardTags(
  { project: 'MyProject', environment: 'nprd' },
  { owner: 'Platform Team', company: 'MyOrganization' },
);

// Add additional tags as needed
const allTags = {
  ...tags,
  Component: 'API',
  CostCenter: 'Engineering',
};

// Apply tags to CDK constructs (requires @codeiqlabs/aws-cdk for applyStandardTags)
// import { applyStandardTags } from '@codeiqlabs/aws-cdk';
// applyStandardTags(stack, allTags);
```

## Manifest Schemas & Generic Configuration Loader

CodeIQLabs AWS Utils provides comprehensive manifest schemas for all AWS account types and a
powerful generic configuration loader with automatic type detection.

### Supported Manifest Types

The library supports four distinct manifest types, each designed for specific AWS account roles:

| Type                  | Purpose                    | Use Case                                                       |
| --------------------- | -------------------------- | -------------------------------------------------------------- |
| **`management`**      | Organizational governance  | AWS Organizations, Identity Center, cross-account roles        |
| **`baseline`**        | Account foundations        | VPC, security groups, compliance services (CloudTrail, Config) |
| **`shared-services`** | Centralized services       | Monitoring, networking, backup, artifact storage               |
| **`workload`**        | Application infrastructure | Multi-environment apps, CI/CD, scaling configurations          |

### Generic Configuration Loader

The generic loader automatically detects manifest types and provides type-safe validation:

```typescript
import { loadManifest, loadManifests, loadManifestsByType } from '@codeiqlabs/aws-utils';

// Load any manifest file with auto-detection
const result = await loadManifest('./manifest.yaml');
if (result.success) {
  console.log(`Loaded ${result.type} manifest`);
  // result.data is properly typed based on detected type
  if (result.type === 'management') {
    console.log(`Organization: ${result.data.organization.name}`);
  }
}

// Load multiple manifests from a directory
const results = await loadManifests('./config/');
console.log(`Found ${results.length} manifest files`);

// Load and organize manifests by type
const organized = await loadManifestsByType('./config/');
console.log(`Management: ${organized.management.length}`);
console.log(`Workload: ${organized.workload.length}`);
console.log(`Errors: ${organized.errors.length}`);
```

## Development

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

# Generate JSON schemas
npm run generate-schemas
```

## 🧪 Testing

```bash
# Run all tests (CJS + ESM import tests)
npm run test:all

# Run individual test suites
npm run test:load    # Configuration loading tests
npm run test:esm     # ESM import tests
```

## Status & Compatibility

- **Current Version:** 1.5.0
- **Node.js:** 18.0.0+
- **TypeScript:** 5.0+
- **Stability:** Production-ready

**Release Notes:** See [CHANGELOG.md](./CHANGELOG.md)

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

MIT – See [LICENSE](./LICENSE) for details.

---

**Part of the CodeIQLabs infrastructure ecosystem** - Standardized AWS utilities for schema-driven
configuration, resource naming, and infrastructure validation.
