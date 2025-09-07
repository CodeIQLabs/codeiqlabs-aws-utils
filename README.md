# @codeiqlabs/aws-utils

**Standardized AWS utilities for enterprise projects** - A comprehensive TypeScript library
providing resource naming, configuration validation, environment management, and tagging utilities
for consistent AWS infrastructure deployment across any organization's projects.

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

## Quick Start for CDK Applications

### Recommended: Use CdkApplication (Automatic Bootstrap)

```typescript
// For CDK applications, use the standardized CdkApplication from @codeiqlabs/aws-cdk
// This example shows how external clients typically consume aws-utils via aws-cdk
import { CdkApplication } from '@codeiqlabs/aws-cdk';
import { ManagementBaseStage } from '@codeiqlabs/aws-cdk';

// CdkApplication automatically uses aws-utils for manifest loading and validation
const app = await CdkApplication.create({ expectedType: 'management' });
app.createManagementStage(ManagementStage);
app.synth();
```

### Advanced: Direct Manifest Loading

```typescript
import { loadManifest, ManifestConfigAdapter } from '@codeiqlabs/aws-utils';

// Load and validate any manifest with auto-detection
const result = await loadManifest('./manifest.yaml');
if (result.success) {
  // Transform to stack configuration
  const stackConfig = ManifestConfigAdapter.toManagementConfig(result.data);
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

### Manual Schema Reference (Alternative)

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
- **Baseline**:
  `https://raw.githubusercontent.com/CodeIQLabs/codeiqlabs-aws-utils/main/schemas/baseline-manifest.schema.json`
- **Workload**:
  `https://raw.githubusercontent.com/CodeIQLabs/codeiqlabs-aws-utils/main/schemas/workload-manifest.schema.json`
- **Shared Services**:
  `https://raw.githubusercontent.com/CodeIQLabs/codeiqlabs-aws-utils/main/schemas/shared-services-manifest.schema.json`

### Editor Support

#### VS Code

- Requires **YAML extension by Red Hat**
- Automatic configuration via `.vscode/settings.json`
- Works with both local and HTTP schema references

#### IntelliJ IDEA

- Built-in YAML support with JSON Schema
- Automatic configuration via `.idea/jsonSchemas.xml`
- HTTP schema URLs provide the most reliable experience

### Supported Manifest Types

The CLI automatically detects your manifest type based on content:

- **Management**: Contains `organization:` and `identityCenter:` sections
- **Workload**: Contains `deploymentPermissions:` or `environments:` sections
- **Shared Services**: Contains `sharedServices:` section

### HTTP vs Local Schemas

**HTTP Schemas (Recommended):**

- Always up-to-date
- No local file management
- Works across all environments
- Most reliable in IntelliJ IDEA
- Requires internet connection

**Local Schemas (Fallback):**

- Works offline
- Faster loading
- Manual updates required
- Path resolution issues in some IDEs

### Troubleshooting

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

### Example: Management Manifest with IntelliSense

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/CodeIQLabs/codeiqlabs-aws-utils/main/schemas/management-manifest.schema.json

project: 'MyOrganization' # Autocomplete suggests valid project names
company: 'MyOrganization' # Validation ensures required field
type: 'management' # Enum validation for manifest types

management: # Contextual autocomplete for nested properties
  accountId: '123456789012' # Pattern validation for 12-digit AWS account ID
  region: 'us-east-1' # AWS region format validation
  environment: 'mgmt' # Enum validation for environment values

organization: # Hover shows detailed documentation
  enabled: true # Boolean validation
  rootId: 'r-abc123' # Organization root ID pattern validation
  mode: 'adopt' # Enum: "create" or "adopt"

  organizationalUnits: # Array validation with item schemas
    - key: 'production' # Key format validation
      name: 'Production' # Required field validation
      accounts: # Nested array validation
        - key: 'prod-account' # Account key validation
          name: 'Production Account'
          email: 'aws+prod@company.com' # Email format validation
          environment: 'prod' # Environment enum validation
          purpose: 'Production workloads'

identityCenter: # Complex object validation
  enabled: true
  instanceArn: 'arn:aws:sso:::instance/ssoins-abc123' # ARN format validation
  permissionSets: # Array of permission set objects
    - name: 'ReadOnlyAccess' # Required field validation
      description: 'Read-only access to AWS resources'
      sessionDuration: 'PT8H' # ISO 8601 duration format validation
```

**IntelliSense Features in Action:**

- **Type `org`** → Suggests `organization:`
- **Inside `management:`** → Suggests `accountId:`, `region:`, `environment:`
- **Invalid values** → Red underlines with error messages
- **Hover over properties** → Shows descriptions and examples
- **Contextual suggestions** → Only relevant properties for each section

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

#### Environment-Specific Naming

```typescript
import { ResourceNaming, ENV_VALUES } from '@codeiqlabs/aws-utils';

// Use standardized environment values
const prodNaming = new ResourceNaming({ project: 'MyProject', environment: 'prod' });
const nprdNaming = new ResourceNaming({ project: 'MyProject', environment: 'nprd' });
const mgmtNaming = new ResourceNaming({ project: 'MyProject', environment: 'mgmt' });

// All generate consistent, environment-specific names
const prodBucket = prodNaming.s3BucketName('data'); // "myproject-prod-data-abc123"
const nprdBucket = nprdNaming.s3BucketName('data'); // "myproject-nprd-data-abc123"
const mgmtBucket = mgmtNaming.s3BucketName('data'); // "myproject-mgmt-data-abc123"
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

#### Advanced Tagging with Custom Tags

```typescript
import { generateStandardTags } from '@codeiqlabs/aws-utils';

// Generate standard tags and combine with custom tags
const standardTags = generateStandardTags(
  { project: 'MyProject', environment: 'prod' },
  { owner: 'platform-team', company: 'MyOrganization' },
);

// Combine with custom tags
const allTags = {
  ...standardTags,
  // Custom tags specific to this resource
  Component: 'database',
  BackupSchedule: 'daily',
  DataClassification: 'sensitive',
  CostCenter: 'engineering',
};

// Result includes both standard and custom tags
```

#### Tagging Best Practices

```typescript
import { generateStandardTags, ENV_VALUES } from '@codeiqlabs/aws-utils';

// Use consistent configuration across resources
const namingConfig = {
  project: 'MyProject',
  environment: 'prod' as const, // Use standardized environment values
};

const taggingOptions = {
  owner: 'platform-team',
  company: 'MyOrganization',
};

// Generate tags for different components
const apiTags = {
  ...generateStandardTags(namingConfig, taggingOptions),
  Component: 'api-gateway',
};

const dbTags = {
  ...generateStandardTags(namingConfig, taggingOptions),
  Component: 'database',
};

const cacheTags = {
  ...generateStandardTags(namingConfig, taggingOptions),
  Component: 'cache',
};
```

### Integration with CDK

The naming and tagging utilities integrate seamlessly with AWS CDK:

```typescript
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { ResourceNaming, generateStandardTags } from '@codeiqlabs/aws-utils';

// Initialize naming configuration
const namingConfig = { project: 'MyProject', environment: 'prod' };
const naming = new ResourceNaming(namingConfig);

// Generate standard tags
const standardTags = generateStandardTags(namingConfig, {
  owner: 'platform-team',
  company: 'MyOrganization',
});

// Add component-specific tags
const tags = {
  ...standardTags,
  Component: 'storage',
};

// Create S3 bucket with consistent naming and tagging
const bucket = new Bucket(this, 'DataBucket', {
  bucketName: naming.s3Bucket('application-data'),
});

// Apply tags to the bucket
Object.entries(tags).forEach(([key, value]) => {
  bucket.node.addTag(key, value);
});
```

## Build System

This package uses **tsup** for modern dual ESM/CJS publishing:

- **Fast builds** with automatic optimization and tree-shaking
- **Source maps** for better debugging experience
- **Type definitions** automatically generated for both ESM and CJS
- **Modern bundler approach** following TypeScript library best practices

## Schema Usage Patterns

The aws-utils package provides comprehensive Zod schemas for configuration validation and type
generation, enabling schema-driven development patterns.

### Basic Schema Usage

```typescript
import {
  ManagementManifestSchema,
  WorkloadManifestSchema,
} from '@codeiqlabs/aws-utils/config/schemas';
import type { ManagementManifest, WorkloadManifest } from '@codeiqlabs/aws-utils/config/schemas';

// Validate configuration at runtime
const validateManagementConfig = (config: unknown): ManagementManifest => {
  return ManagementManifestSchema.parse(config);
};

// Type-safe configuration with z.infer
type ManagementConfig = z.infer<typeof ManagementManifestSchema>;
type WorkloadConfig = z.infer<typeof WorkloadManifestSchema>;
```

### Schema Composition and Extension

```typescript
import { BaseManifestSchema, EnvironmentSchema } from '@codeiqlabs/aws-utils/config/schemas';

// Extend base schemas for custom use cases
const CustomManifestSchema = BaseManifestSchema.extend({
  customSection: z.object({
    feature: z.boolean(),
    configuration: z.string().optional(),
  }),
});

// Compose schemas for complex validation
const DeploymentConfigSchema = z.object({
  manifest: ManagementManifestSchema,
  environment: EnvironmentSchema,
  deploymentOptions: z.object({
    skipValidation: z.boolean().default(false),
    dryRun: z.boolean().default(false),
  }),
});
```

### Manifest-Driven Configuration Integration

```typescript
import { loadManifest, validateManifest } from '@codeiqlabs/aws-utils/config';

// Load and validate manifest files
const loadAndValidateConfig = async (manifestPath: string) => {
  // Load YAML/JSON manifest
  const rawConfig = await loadManifest(manifestPath);

  // Validate against appropriate schema
  const validatedConfig = validateManifest(rawConfig);

  // Type-safe configuration ready for use
  return validatedConfig;
};

// Use in CDK applications
const config = await loadAndValidateConfig('./src/manifest.yaml');

// TypeScript knows the exact shape of config
if (config.type === 'management') {
  // config.organization is available and typed
  console.log(config.organization?.rootId);
} else if (config.type === 'workload') {
  // config.environments is available and typed
  console.log(config.environments?.length);
}
```

### Type Generation from Schemas

```typescript
import { z } from 'zod';
import {
  ManagementManifestSchema,
  WorkloadManifestSchema,
  OrganizationSchema,
  EnvironmentConfigSchema,
} from '@codeiqlabs/aws-utils/config/schemas';

// Generate TypeScript types from schemas
export type ManagementManifest = z.infer<typeof ManagementManifestSchema>;
export type WorkloadManifest = z.infer<typeof WorkloadManifestSchema>;
export type Organization = z.infer<typeof OrganizationSchema>;
export type EnvironmentConfig = z.infer<typeof EnvironmentConfigSchema>;

// Use generated types in function signatures
const processManagementConfig = (config: ManagementManifest): void => {
  // TypeScript provides full autocomplete and type checking
  if (config.organization?.enabled) {
    config.organization.organizationalUnits?.forEach((ou) => {
      console.log(`Processing OU: ${ou.name}`);
      ou.accounts?.forEach((account) => {
        console.log(`  Account: ${account.name} (${account.environment})`);
      });
    });
  }
};
```

### Schema Validation with Error Handling

```typescript
import { ZodError } from 'zod';
import { ManagementManifestSchema } from '@codeiqlabs/aws-utils/config/schemas';

const safeValidateConfig = (config: unknown) => {
  try {
    return {
      success: true,
      data: ManagementManifestSchema.parse(config),
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        errors: error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
          code: err.code,
        })),
      };
    }
    throw error;
  }
};

// Usage with detailed error reporting
const result = safeValidateConfig(userConfig);
if (!result.success) {
  console.error('Configuration validation failed:');
  result.errors.forEach((error) => {
    console.error(`  ${error.path}: ${error.message}`);
  });
} else {
  // Use validated configuration
  const config = result.data;
}
```

### Advanced Schema Patterns

```typescript
// Discriminated union validation
const ManifestSchema = z.discriminatedUnion('type', [
  ManagementManifestSchema,
  WorkloadManifestSchema,
  SharedServicesManifestSchema,
]);

// Conditional validation based on manifest type
const validateManifestByType = (config: unknown) => {
  const manifest = ManifestSchema.parse(config);

  switch (manifest.type) {
    case 'management':
      // TypeScript knows this is ManagementManifest
      return validateManagementSpecificRules(manifest);
    case 'workload':
      // TypeScript knows this is WorkloadManifest
      return validateWorkloadSpecificRules(manifest);
    default:
      throw new Error(`Unsupported manifest type: ${manifest.type}`);
  }
};
```

## Usage Examples

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

### Manifest Examples

#### Management Manifest

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/CodeIQLabs/codeiqlabs-aws-utils/main/schemas/management-manifest.schema.json

project: 'MyOrganization'
company: 'MyOrganization'
type: 'management'

management:
  accountId: '${MANAGEMENT_ACCOUNT_ID}'
  region: 'us-east-1'
  environment: 'mgmt'

organization:
  enabled: true
  rootId: '${ORG_ROOT_ID}'
  mode: 'adopt'
  organizationalUnits:
    - key: 'production'
      name: 'Production'
      accounts:
        - key: 'prod-account'
          name: 'Production Account'
          email: 'aws+prod@company.com'
          environment: 'prod'
          purpose: 'Production workloads'
          accountId: '123456789012'

identityCenter:
  enabled: true
  instanceArn: '${SSO_INSTANCE_ARN}'
  permissionSets:
    - name: 'ReadOnlyAccess'
      description: 'Read-only access'
      sessionDuration: 'PT8H'
      managedPolicies: ['arn:aws:iam::aws:policy/ReadOnlyAccess']

options:
  enableOrganizationCloudTrail: true
  enableOrganizationConfig: true
  requireMfaForIdentityCenter: true
```

#### Baseline Manifest

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/CodeIQLabs/codeiqlabs-aws-utils/main/schemas/baseline-manifest.schema.json

project: 'MyProject'
company: 'MyOrganization'
type: 'baseline'

management:
  accountId: '${MANAGEMENT_ACCOUNT_ID}'
  region: 'us-east-1'
  environment: 'mgmt'

networking:
  mode: 'create'
  vpc:
    name: 'main-vpc'
    cidr: '10.0.0.0/16'
    region: 'us-east-1'
    subnets:
      - name: 'public-subnet-1'
        type: 'public'
        cidr: '10.0.1.0/24'
        availabilityZone: 'us-east-1a'
      - name: 'private-subnet-1'
        type: 'private'
        cidr: '10.0.2.0/24'
        availabilityZone: 'us-east-1a'

security:
  securityGroups:
    - name: 'web-sg'
      description: 'Security group for web servers'
      rules:
        - type: 'ingress'
          protocol: 'tcp'
          port: 443
          source:
            type: 'cidr'
            cidr: '0.0.0.0/0'

compliance:
  cloudTrail:
    name: 'organization-trail'
    enabled: true
    s3Config:
      bucketName: 'cloudtrail-logs-bucket'
      isMultiRegionTrail: true
  guardDuty:
    enabled: true
  securityHub:
    enabled: true
```

#### Workload Manifest

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/CodeIQLabs/codeiqlabs-aws-utils/main/schemas/workload-manifest.schema.json

project: 'MyApp'
company: 'MyOrganization'
type: 'workload'

management:
  accountId: '${MANAGEMENT_ACCOUNT_ID}'
  region: 'us-east-1'
  environment: 'mgmt'

environments:
  nprd:
    accountId: '${NPRD_ACCOUNT_ID}'
    region: 'us-east-1'
    environment: 'nprd'
    config:
      scaling:
        minCapacity: 1
        maxCapacity: 5
      monitoring:
        enableDetailedMonitoring: true
        logLevel: 'DEBUG'
  prod:
    accountId: '${PROD_ACCOUNT_ID}'
    region: 'us-east-1'
    environment: 'prod'
    config:
      scaling:
        minCapacity: 2
        maxCapacity: 20
      monitoring:
        enableDetailedMonitoring: true
        logLevel: 'INFO'

applications:
  - name: 'web-api'
    description: 'Main web API'
    runtime:
      type: 'container'
      platform: 'linux/amd64'

options:
  enableBlueGreenDeployment: true
  enableAutomatedTesting: true
```

#### Shared Services Manifest

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/CodeIQLabs/codeiqlabs-aws-utils/main/schemas/shared-services-manifest.schema.json

project: 'SharedServices'
company: 'MyOrganization'
type: 'shared-services'

management:
  accountId: '${MANAGEMENT_ACCOUNT_ID}'
  region: 'us-east-1'
  environment: 'mgmt'

sharedServices:
  services:
    monitoring:
      enabled: true
      centralLogging: true
      crossAccountAccess: true
    networking:
      transitGateway:
        enabled: true
        enableDnsSupport: true
    security:
      certificateManager:
        enabled: true
        crossAccountSharing: true
    backup:
      enabled: true
      crossAccountBackup: true

options:
  enableCrossAccountSharing: true
  enableResourceAccessManager: true
```

### Advanced Loader Options

```typescript
import { loadManifest, LoadManifestOptions } from '@codeiqlabs/aws-utils';

const options: LoadManifestOptions = {
  expandEnvVars: true, // Expand ${VAR_NAME} syntax
  envVars: {
    // Custom environment variables
    CUSTOM_VAR: 'custom-value',
  },
  validate: true, // Schema validation (recommended)
};

const result = await loadManifest('./manifest.yaml', options);
```

### Type-Safe Processing

```typescript
import { loadManifestsByType } from '@codeiqlabs/aws-utils';

const manifests = await loadManifestsByType('./config/');

// Process each type with full type safety
for (const mgmt of manifests.management) {
  console.log(`Organization: ${mgmt.data.organization.name}`);
  console.log(`Identity Center: ${mgmt.data.identityCenter.enabled}`);
}

for (const workload of manifests.workload) {
  console.log(`Environments: ${Object.keys(workload.data.environments)}`);
  for (const app of workload.data.applications || []) {
    console.log(`Application: ${app.name} (${app.runtime?.type})`);
  }
}

// Handle errors gracefully
for (const error of manifests.errors) {
  console.error(`Failed to load ${error.filePath}: ${error.error}`);
}
```

## Enhanced Schema Generation

The package includes a comprehensive enhanced schema generation system with discriminated unions and
optimized validation.

### Key Features

- **Discriminated Union Architecture**: Automatic type detection using the `type` field
- **Centralized Primitives**: Reusable components in `$defs` section (AwsAccountId, AwsRegion,
  ProjectName, etc.)
- **Enhanced Error Messages**: Actionable validation guidance for better developer experience
- **Strict Validation**: Comprehensive property validation with `additionalProperties: false`
- **JSON Schema 2020-12**: Latest specification with modern validation features

### TypeScript Integration

```typescript
import { ManifestSchema, type Manifest } from '@codeiqlabs/aws-utils';

// Runtime validation with automatic type inference
const manifest: Manifest = ManifestSchema.parse(data);

// Type-safe processing with discriminated unions
function processManifest(manifest: Manifest) {
  switch (manifest.type) {
    case 'management':
      // TypeScript knows this is ManagementAppConfig
      console.log(manifest.organization.enabled);
      break;
    case 'workload':
      // TypeScript knows this is WorkloadAppConfig
      console.log(Object.keys(manifest.environments));
      break;
    case 'shared-services':
      // TypeScript knows this is SharedServicesAppConfig
      console.log(manifest.sharedServices);
      break;
    case 'baseline':
      // TypeScript knows this is BaselineAppConfig
      console.log(manifest.networking.mode);
      break;
    default:
      // TypeScript ensures exhaustive checking
      const _exhaustive: never = manifest;
      throw new Error(`Unknown manifest type: ${_exhaustive}`);
  }
}
```

### Schema Generation

Generate all schemas with enhanced composition:

```bash
npm run generate-schemas
```

This creates:

- `schemas/manifest.schema.json` - **Enhanced unified schema** with discriminated unions
- `schemas/management-manifest.schema.json` - Management account manifests
- `schemas/workload-manifest.schema.json` - Workload account manifests
- `schemas/shared-services-manifest.schema.json` - Shared services manifests
- `schemas/baseline-manifest.schema.json` - Baseline account manifests

### Optimized Primitives

All schemas use centralized, optimized primitives with enhanced error messages:

```typescript
// AWS Resource Identifiers
AwsAccountId: "AWS Account ID must be exactly 12 digits (e.g., '123456789012')";
AwsRegion: "AWS Region must follow the format: {region}-{location}-{number} (e.g., 'us-east-1')";

// Project Identifiers
ProjectName: 'Project name must start with a letter, contain only lowercase letters, numbers, and hyphens';
EnvCode: 'Environment code must be one of: mgmt, shrd, nprd, pprd, prod';

// Contact Information
EmailAddress: "Must be a valid email address (e.g., 'user@example.com')";
CompanyName: 'Company name can contain letters, numbers, spaces, and common punctuation';
```

## Module Formats

This package supports both ESM and CommonJS with automatic dual publishing:

### ESM (Recommended)

```typescript
import {
  ResourceNaming,
  ENV_VALUES,
  validateEnvironment,
  loadManifest,
  generateStandardTags,
} from '@codeiqlabs/aws-utils';
```

### CommonJS

```javascript
const {
  ResourceNaming,
  ENV_VALUES,
  validateEnvironment,
  loadManifest,
  generateStandardTags,
} = require('@codeiqlabs/aws-utils');
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
```

## 🧪 Testing

```bash
# Run all tests (CJS + ESM import tests)
npm run test:all

# Run individual test suites
npm run test:load    # Configuration loading tests
npm run test:esm     # ESM import tests
```

## Configuration Schemas

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

## Integration with @codeiqlabs/eslint-prettier-config

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

## Release Process

This package uses automated release management with changesets:

1. **Make changes** and create a changeset: `npm run changeset`
2. **Commit changes** with descriptive messages
3. **Create Pull Request** - CI validates builds and tests
4. **Merge PR** - Automated release workflow publishes to GitHub Packages

### Versioning

- **patch**: Bug fixes, documentation updates, internal refactoring
- **minor**: New features, new utilities, additive changes
- **major**: Breaking changes, removed features, changed APIs

## License

MIT - See [LICENSE](LICENSE) file for details.

---

**Part of the CodeIQLabs infrastructure ecosystem** - Comprehensive AWS utilities for schema-driven
configuration, resource naming, and infrastructure validation.

**Part of the CodeIQLabs infrastructure ecosystem** - Standardizing AWS deployments across all
projects with consistent naming, validation, and management utilities.
