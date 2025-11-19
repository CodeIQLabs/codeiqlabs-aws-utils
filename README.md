# CodeIQLabs AWS Utils (@codeiqlabs/aws-utils)

**Framework-agnostic AWS utilities for naming, tagging, manifest validation, and schema-driven configuration.**

[![npm version](https://img.shields.io/npm/v/@codeiqlabs/aws-utils.svg)](https://www.npmjs.com/package/@codeiqlabs/aws-utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.18-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4%2B-blue.svg)](https://www.typescriptlang.org/)
[![Module Support](https://img.shields.io/badge/modules-ESM%20%2B%20CJS-brightgreen.svg)](https://nodejs.org/api/esm.html)

---

## Overview

`@codeiqlabs/aws-utils` is a **framework-agnostic** utility library designed to standardize AWS infrastructure code across CodeIQLabs projects. It provides:

- **Schema-driven configuration** with Zod validation for AWS manifests (accounts, organizations, identity center, networking, domains, projects)
- **Standardized resource naming** for stacks, S3 buckets, IAM roles, SSM parameters, and domains
- **Consistent tagging** with environment-aware tag generation
- **Environment variable helpers** with strict validation
- **CLI tools** for IDE IntelliSense setup with JSON Schema support
- **Dual module support** (ESM + CommonJS) for maximum compatibility

Used as the **shared foundation** for other CodeIQLabs infrastructure packages like [`@codeiqlabs/aws-cdk`](https://github.com/CodeIQLabs/codeiqlabs-aws-cdk).

---

## Features

### 📋 Configuration & Manifest Utilities

- **Load YAML config/manifest files** with `loadConfig()`, `loadManifest()`, `initializeApp()`
- **Expand `${VAR}` placeholders** from environment variables automatically
- **Validate configs** with Zod schemas for:
  - AWS accounts and organizations
  - Identity Center (users, groups, permission sets, assignments)
  - Networking (VPCs, subnets, security groups)
  - Security and compliance settings
  - Domain management and DNS
  - Project and environment configurations
- **Unified `UnifiedAppConfig` schema** supporting:
  - Single-account and multi-environment deployments
  - Component flags: `organization`, `identityCenter`, `domains`, `staticHosting`, `networking`, `deploymentPermissions`
  - Flexible `deployment` + `environments` structure

### 🏷️ Naming Utilities

Standardized naming functions for AWS resources:

- **`generateStackName()`** - CDK stack names: `MyApp-prod-API-Stack`
- **`generateExportName()`** - CloudFormation exports: `myapp-prod-vpc-id`
- **`generateResourceName()`** - Generic resources: `myapp-prod-lambda-function`
- **`generateIAMRoleName()`** - IAM roles: `MyApp-prod-DeploymentRole`
- **`generateS3BucketName()`** - S3 buckets with stable suffixes: `myapp-prod-artifacts-abc123`
- **`generateSSMParameterName()`** - SSM parameters: `/MyApp/prod/config/api-key`
- **`generateDomainName()`** - Domain names with subdomains: `api.example.com`
- **`generateStageName()`** - CDK stage names with environment validation: `MyApp-prod`

**Convenience class:**

```typescript
import { ResourceNaming } from '@codeiqlabs/aws-utils';

const naming = new ResourceNaming({
  project: 'MyApp',
  environment: 'prod',
  region: 'us-east-1',
  accountId: '123456789012',
});

const stackName = naming.stackName('API');
const bucketName = naming.s3BucketName('artifacts');
const tags = naming.standardTags({ owner: 'Platform Team' });
```

### 🏷️ Tagging Utilities

- **`generateStandardTags()`** - Produces canonical tag set:
  - `App` - Application/project name
  - `Environment` - Environment (NonProd, Prod, Management, Shared)
  - `Owner` - Resource owner
  - `Company` - Company name
  - `ManagedBy` - Management tool (defaults to 'aws-utils')
- **Environment-aware tag normalization** - Automatically maps `nprd` → `NonProd`, `prod` → `Prod`, etc.

### 🔧 Environment Helpers

- **`getRequiredEnvVar()`** - Get required environment variable (throws if missing)
- **`getRequiredEnvVarStrict()`** - Get required environment variable with strict validation
- **`getAccountIdFromEnv()`** - Get AWS account ID from environment variable
- **`getEnvVarWithDefault()`** - Get environment variable with default value
- **`ENV_VALUES`** - Validated environment constants: `nprd`, `prod`, `mgmt`, `shrd`, `pprd`
- **`validateEnvironment()`** - Validate environment against allowed values
- **`isValidEnvironment()`** - Check if environment is valid

### 🛠️ CLI & Schema Generation

- **`npx @codeiqlabs/aws-utils setup-intellisense`** - Wire manifest schema into VS Code / IntelliJ YAML/JSON settings for autocomplete
- **`npm run generate-schemas`** - Emit `schemas/manifest.schema.json` from Zod schemas
- **JSON Schemas** hosted on GitHub for IDE IntelliSense:
  - `https://raw.githubusercontent.com/CodeIQLabs/codeiqlabs-aws-utils/main/schemas/manifest.schema.json`
  - `https://raw.githubusercontent.com/CodeIQLabs/codeiqlabs-aws-utils/main/schemas/management-manifest.schema.json`
  - `https://raw.githubusercontent.com/CodeIQLabs/codeiqlabs-aws-utils/main/schemas/workload-manifest.schema.json`

---

## Architecture

### How It's Organized

```
@codeiqlabs/aws-utils/
├── src/
│   ├── application/        # Higher-level helpers (initializeApp, manifest loader)
│   ├── config/             # YAML loaders, manifest loaders, Zod schemas
│   │   ├── schemas/
│   │   │   ├── base/       # Base schemas (accounts, environments, tags)
│   │   │   ├── resources/  # Resource schemas (networking, security, domains)
│   │   │   └── applications/ # Application schemas (unified config)
│   │   └── utils/          # Config utilities (YAML loading, env var expansion)
│   ├── naming/             # Naming functions + ResourceNaming class + types
│   ├── tagging/            # Tagging functions + types + convenience helpers
│   ├── helpers/            # Environment variable helpers
│   ├── constants/          # Environment constants and validation
│   ├── cli/                # setup-intellisense entrypoint
│   └── index.ts            # Main package entry point
├── schemas/                # Generated JSON schemas for manifests
├── scripts/                # generate-schemas.ts
└── tests/                  # Dual ESM/CJS import tests
```

### Export Strategy

The package uses a **multi-level export strategy** for flexibility:

1. **Main Export** (`@codeiqlabs/aws-utils`) - Most commonly used utilities
2. **Subpath Exports** - Specialized modules:
   - `@codeiqlabs/aws-utils/naming` - Naming utilities
   - `@codeiqlabs/aws-utils/tagging` - Tagging utilities
   - `@codeiqlabs/aws-utils/constants` - Constants
   - `@codeiqlabs/aws-utils/config` - Configuration utilities
   - `@codeiqlabs/aws-utils/helpers` - Helper functions

---

## Quick Start

### Installation

```bash
npm install @codeiqlabs/aws-utils
```

### Basic Usage

#### 1. Load & Validate a Manifest

```typescript
import { loadManifest, initializeApp } from '@codeiqlabs/aws-utils';

// Option 1: Generic loader with auto-detection
const result = await loadManifest('./manifest.yaml');

if (result.success) {
  console.log(`Loaded ${result.type} manifest`);
  console.log('Project:', result.data.project);
  console.log('Deployment:', result.data.deployment);
} else {
  console.error('Validation failed:', result.error);
}

// Option 2: Enhanced loader for CDK apps
const appResult = await initializeApp('src/manifest.yaml');

if (appResult.success) {
  const config = appResult.data;
  // Use strongly-typed config with env var expansion and validation
}
```

#### 2. Standardized Resource Naming

```typescript
import { generateStackName, generateS3BucketName, ResourceNaming } from '@codeiqlabs/aws-utils';

// Option 1: Direct function calls
const stackName = generateStackName(
  { project: 'MyApp', environment: 'prod' },
  'API'
);
// Result: "MyApp-prod-API-Stack"

const bucketName = generateS3BucketName(
  { project: 'MyApp', environment: 'prod', accountId: '123456789012', region: 'us-east-1' },
  { purpose: 'artifacts' }
);
// Result: "myapp-prod-artifacts-abc123"

// Option 2: Convenience class (recommended for multiple resources)
const naming = new ResourceNaming({
  project: 'MyApp',
  environment: 'prod',
  region: 'us-east-1',
  accountId: '123456789012',
});

const apiStack = naming.stackName('API');
const artifactsBucket = naming.s3BucketName('artifacts');
const deployRole = naming.iamRoleName('DeploymentRole');
const apiParam = naming.ssmParameterName('config', 'api-key');
// Result: "/MyApp/prod/config/api-key"
```

#### 3. Standard Tagging

```typescript
import { generateStandardTags } from '@codeiqlabs/aws-utils';

const tags = generateStandardTags(
  { project: 'MyApp', environment: 'prod' },
  { owner: 'Platform Team', company: 'MyCompany' }
);

// Result:
// {
//   App: 'MyApp',
//   Environment: 'Prod',
//   Owner: 'Platform Team',
//   Company: 'MyCompany',
//   ManagedBy: 'aws-utils'
// }

// Use with ResourceNaming for convenience
const naming = new ResourceNaming({ project: 'MyApp', environment: 'prod' });
const tags = naming.standardTags({ owner: 'Platform Team' });
```

#### 4. CLI Usage - Setup IntelliSense

```bash
# Auto-detect and set up IntelliSense for all manifest files
npx @codeiqlabs/aws-utils setup-intellisense

# Set up for a specific manifest file
npx @codeiqlabs/aws-utils setup-intellisense --manifest=src/manifest.yaml

# Force a specific manifest type
npx @codeiqlabs/aws-utils setup-intellisense --type=management

# Run in quiet mode
npx @codeiqlabs/aws-utils setup-intellisense --auto --quiet
```

**What it does:**
- Configures VS Code YAML schema mappings in `.vscode/settings.json`
- Configures IntelliJ IDEA JSON schema mappings in `.idea/jsonSchemas.xml`
- Adds schema reference comments to your manifest files
- Enables autocomplete, validation, and hover documentation in your IDE

---

## Common Use Cases

### When to Use This Library

✅ **Standardize naming and tagging** across multiple AWS infrastructure projects  
✅ **Use a single manifest schema** to configure organizations, identity center, domains, projects, and networking  
✅ **Add IDE IntelliSense** for AWS infrastructure manifests via JSON Schema  
✅ **Share configuration primitives** between CDK apps (`@codeiqlabs/aws-cdk`) and other tools  
✅ **Validate environment variables** with strict type checking  
✅ **Generate consistent resource names** that comply with AWS service limits  

---

## Relationship to Other CodeIQLabs Packages

`@codeiqlabs/aws-utils` is the **foundation layer** for CodeIQLabs infrastructure tooling:

- **`@codeiqlabs/aws-cdk`** - CDK-specific layer that builds on these utilities (component-based orchestration, constructs, stacks)
- **`codeiqlabs-management-aws`** - Management account infrastructure (uses aws-utils for naming/tagging/config)
- **`codeiqlabs-customization-aws`** - Deployment permissions and GitHub OIDC (uses aws-utils for naming/tagging/config)
- **`codeiqlabs-saas-aws`** - SaaS application infrastructure (uses aws-utils + aws-cdk)

This separation allows you to use the core utilities in **any** infrastructure tooling (CDK, Terraform, Pulumi, AWS SDK) without coupling to CDK.

---

## Status & Compatibility

- **Current Version:** 1.7.1
- **Node.js:** >=18.18
- **TypeScript:** >=5.4.0
- **Module Support:** ESM + CommonJS (via tsup)
- **Stability:** Production-used, API may evolve with breaking changes noted in the [CHANGELOG](./CHANGELOG.md)

---

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## License

[MIT](./LICENSE) © CodeIQLabs

---

## Documentation & Resources

- **[Complete File Reference](./docs/codeiqlabs/aws-utils/complete-file-reference.md)** - Detailed documentation of every file and module
- **[Manifest Schema](https://raw.githubusercontent.com/CodeIQLabs/codeiqlabs-aws-utils/main/schemas/manifest.schema.json)** - JSON Schema for IDE autocomplete
- **[GitHub Repository](https://github.com/CodeIQLabs/codeiqlabs-aws-utils)** - Source code and issues
- **[Changelog](./CHANGELOG.md)** - Version history and breaking changes

