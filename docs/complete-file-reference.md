# CodeIQLabs AWS Utils - Complete File Reference

This document provides a comprehensive reference of every file in the `codeiqlabs-aws-utils`
repository and its purpose.

## Repository Overview

**Package Name**: `@codeiqlabs/aws-utils` **Version**: 1.7.1 **Description**: AWS utilities
including resource naming, configuration validation, and environment management for CodeIQLabs
projects **Architecture**: Framework-agnostic utilities providing schema-driven configuration,
resource naming, tagging, and manifest validation with dual ESM/CommonJS support

---

## Root Directory Files

### Configuration Files

- **[`package.json`](../package.json)** - NPM package configuration defining dependencies, scripts,
  and package metadata. Exports both ESM and CommonJS formats with subpath exports for modular
  imports (`/naming`, `/tagging`, `/constants`, etc.).

- **[`tsconfig.json`](../tsconfig.json)** - TypeScript compiler configuration for the project.

- **[`tsup.config.ts`](../tsup.config.ts)** - Modern bundler configuration using tsup for dual
  ESM/CJS builds with source maps and type declarations.

- **[`eslint.config.mjs`](../eslint.config.mjs)** - ESLint configuration for code linting and style
  enforcement.

- **[`prettier.config.mjs`](../prettier.config.mjs)** - Prettier configuration for code formatting.

- **[`lint-staged.config.mjs`](../lint-staged.config.mjs)** - Configuration for lint-staged to run
  linters on git staged files.

### Documentation Files

- **[`README.md`](../README.md)** - Main package documentation with feature overview, installation
  instructions, usage examples, and API reference.

- **[`CHANGELOG.md`](../CHANGELOG.md)** - Version history and release notes tracking all changes to
  the package.

- **[`CONTRIBUTING.md`](../CONTRIBUTING.md)** - Guidelines for contributing to the project.

- **[`LICENSE`](../LICENSE)** - MIT license file for the package.

---

## `/src` - Source Code Directory

**Total TypeScript Files: 39**

### Complete File List

#### Application Layer (2 files)

1. [`src/application/index.ts`](../src/application/index.ts)
2. [`src/application/manifest-loader.ts`](../src/application/manifest-loader.ts)

#### CLI Tools (2 files)

3. [`src/cli/index.ts`](../src/cli/index.ts)
4. [`src/cli/setup-intellisense.ts`](../src/cli/setup-intellisense.ts)

#### Configuration Layer (24 files)

5. [`src/config/index.ts`](../src/config/index.ts)
6. [`src/config/utils/index.ts`](../src/config/utils/index.ts)
7. [`src/config/utils/loaders.ts`](../src/config/utils/loaders.ts)
8. [`src/config/schemas/index.ts`](../src/config/schemas/index.ts)
9. [`src/config/schemas/generate-json-schema.ts`](../src/config/schemas/generate-json-schema.ts)
10. [`src/config/schemas/applications/index.ts`](../src/config/schemas/applications/index.ts)
11. [`src/config/schemas/applications/unified.ts`](../src/config/schemas/applications/unified.ts)
12. [`src/config/schemas/base/index.ts`](../src/config/schemas/base/index.ts)
13. [`src/config/schemas/base/aws-primitives.ts`](../src/config/schemas/base/aws-primitives.ts)
14. [`src/config/schemas/base/common.ts`](../src/config/schemas/base/common.ts)
15. [`src/config/schemas/base/manifest-base.ts`](../src/config/schemas/base/manifest-base.ts)
16. [`src/config/schemas/base/primitives.ts`](../src/config/schemas/base/primitives.ts)
17. [`src/config/schemas/resources/index.ts`](../src/config/schemas/resources/index.ts)
18. [`src/config/schemas/resources/accounts.ts`](../src/config/schemas/resources/accounts.ts)
19. [`src/config/schemas/resources/compliance.ts`](../src/config/schemas/resources/compliance.ts)
20. [`src/config/schemas/resources/deployment-permissions.ts`](../src/config/schemas/resources/deployment-permissions.ts)
21. [`src/config/schemas/resources/domains.ts`](../src/config/schemas/resources/domains.ts)
22. [`src/config/schemas/resources/github-oidc.ts`](../src/config/schemas/resources/github-oidc.ts)
23. [`src/config/schemas/resources/iam.ts`](../src/config/schemas/resources/iam.ts)
24. [`src/config/schemas/resources/identity-center.ts`](../src/config/schemas/resources/identity-center.ts)
25. [`src/config/schemas/resources/networking.ts`](../src/config/schemas/resources/networking.ts)
26. [`src/config/schemas/resources/organizations.ts`](../src/config/schemas/resources/organizations.ts)
27. [`src/config/schemas/resources/projects.ts`](../src/config/schemas/resources/projects.ts)
28. [`src/config/schemas/resources/security.ts`](../src/config/schemas/resources/security.ts)
29. [`src/config/schemas/validation/manifest-validators.ts`](../src/config/schemas/validation/manifest-validators.ts)

#### Constants (2 files)

30. [`src/constants/index.ts`](../src/constants/index.ts)
31. [`src/constants/environments.ts`](../src/constants/environments.ts)

#### Helpers (2 files)

32. [`src/helpers/index.ts`](../src/helpers/index.ts)
33. [`src/helpers/env.ts`](../src/helpers/env.ts)

#### Naming Utilities (4 files)

34. [`src/naming/index.ts`](../src/naming/index.ts)
35. [`src/naming/convenience.ts`](../src/naming/convenience.ts)
36. [`src/naming/functions.ts`](../src/naming/functions.ts)
37. [`src/naming/types.ts`](../src/naming/types.ts)

#### Tagging Utilities (4 files)

38. [`src/tagging/index.ts`](../src/tagging/index.ts)
39. [`src/tagging/convenience.ts`](../src/tagging/convenience.ts)
40. [`src/tagging/functions.ts`](../src/tagging/functions.ts)
41. [`src/tagging/types.ts`](../src/tagging/types.ts)

#### Main Entry Point (1 file)

42. [`src/index.ts`](../src/index.ts)

---

## Detailed File Descriptions

### Main Entry Point

#### [`/src/index.ts`](../src/index.ts)

**Purpose**: Main package entry point that exports all public APIs.

**Key Exports**:

- Constants (environment values)
- Helper utilities (environment variables, validation)
- Application utilities (manifest loading)
- Configuration utilities (YAML loading, schema validation)
- Naming utilities (resource naming, stage name generation)
- Tagging utilities (tag generation)
- Type definitions for all modules

**Package Metadata**:

- `VERSION` - Package version constant
- `PACKAGE_NAME` - Package name constant

---

### Application Layer

#### [`/src/application/index.ts`](../src/application/index.ts)

**Purpose**: Main entry point for application utilities module.

**Key Exports**:

- `initializeApp()` - Enhanced manifest loading with validation for CDK bootstrap
- Application-specific type definitions

**Usage**: Provides utilities specifically designed for CDK application bootstrap scenarios.

#### [`/src/application/manifest-loader.ts`](../src/application/manifest-loader.ts)

**Purpose**: Enhanced manifest loading and validation for CDK applications.

**Key Responsibilities**:

- Load manifest files with comprehensive validation
- Provide detailed error reporting
- Support verbose logging for debugging
- Type-safe manifest configuration handling

**Key Functions**:

- `initializeApp()` - Load and validate manifest with enhanced error handling

**Key Types**:

- `ApplicationManifestConfig` - Type-safe manifest configuration
- `ApplicationManifestResult` - Result type for manifest loading
- `InitializeAppOptions` - Options for manifest initialization

---

### CLI Tools

#### [`/src/cli/index.ts`](../src/cli/index.ts)

**Purpose**: Main entry point for CLI tools.

**Key Exports**:

- CLI command implementations
- Command-line interface utilities

#### [`/src/cli/setup-intellisense.ts`](../src/cli/setup-intellisense.ts)

**Purpose**: CLI tool for setting up IDE IntelliSense for manifest files.

**Key Responsibilities**:

- Auto-detect manifest files in project
- Configure VS Code YAML schema mappings
- Configure IntelliJ IDEA JSON schema mappings
- Support both automatic and manual configuration modes

**Key Features**:

- Automatic manifest type detection
- IDE-specific configuration generation
- Interactive prompts for user input
- Quiet mode for CI/CD environments

**CLI Usage**:

```bash
npx @codeiqlabs/aws-utils setup-intellisense
npx @codeiqlabs/aws-utils setup-intellisense --manifest=src/manifest.yaml
npx @codeiqlabs/aws-utils setup-intellisense --type=management
```

---

### Configuration Layer

#### [`/src/config/index.ts`](../src/config/index.ts)

**Purpose**: Main entry point for configuration utilities.

**Key Exports**:

- Configuration loading functions (`loadConfig`, `loadManifest`)
- Schema definitions and validators
- Type definitions for all configuration types
- Environment variable expansion utilities

**Key Features**:

- YAML configuration file loading
- Environment variable expansion
- Comprehensive Zod schema validation
- Type-safe configuration handling
- Detailed error reporting

#### [`/src/config/utils/index.ts`](../src/config/utils/index.ts)

**Purpose**: Configuration utility functions module entry point.

**Key Exports**:

- `loadConfig()` - Generic YAML configuration loader
- `expandEnvironmentVariables()` - Environment variable expansion
- `loadManifest()` - Manifest-specific loader with auto-detection
- `isManifestFile()` - Manifest file detection utility

#### [`/src/config/utils/loaders.ts`](../src/config/utils/loaders.ts)

**Purpose**: Core configuration loading implementation.

**Key Responsibilities**:

- YAML file parsing and loading
- Environment variable expansion in configuration values
- Generic manifest loading with type detection
- File system operations for configuration files

**Key Functions**:

- `loadConfig()` - Load and parse YAML configuration files
- `expandEnvironmentVariables()` - Replace ${VAR} placeholders with environment values
- `loadManifest()` - Load manifest with automatic type detection
- `loadManifests()` - Load multiple manifests from directory
- `loadManifestsByType()` - Load and organize manifests by type
- `isManifestFile()` - Check if file is a valid manifest

**Key Types**:

- `ManifestFormat` - Supported manifest types ('yaml', 'yml')
- `ManifestLoadResult` - Result of manifest loading operation
- `ManifestLoadError` - Error details for failed loads
- `LoadManifestOptions` - Options for manifest loading

---

### Configuration Schemas

#### [`/src/config/schemas/index.ts`](../src/config/schemas/index.ts)

**Purpose**: Central export point for all Zod schemas.

**Key Exports**:

- Base schemas (primitives, AWS types, common patterns)
- Resource schemas (AWS service-specific)
- Application schemas (unified manifest schema)
- Validation functions

**Organization**:

- **Base Schemas**: Foundational building blocks
- **Resource Schemas**: AWS service-specific configurations
- **Application Schemas**: Complete application manifests

#### [`/src/config/schemas/generate-json-schema.ts`](../src/config/schemas/generate-json-schema.ts)

**Purpose**: Generate JSON Schema files from Zod schemas for IDE integration.

**Key Responsibilities**:

- Convert Zod schemas to JSON Schema format
- Generate unified schema file for IDE autocomplete and validation
- Apply strict validation rules and enhanced error messages
- Create optimized primitive definitions for AWS resources

**Generated Schema**:

- `manifest.schema.json` - Single unified schema supporting all deployment patterns (component-based
  configuration)

### Base Schemas

#### [`/src/config/schemas/base/index.ts`](../src/config/schemas/base/index.ts)

**Purpose**: Export point for foundational schema building blocks.

**Key Exports**:

- Primitive schemas (email, name, description, boolean, URL)
- AWS primitive schemas (region, account ID)
- Common schemas (environment, project name, company name, tags)
- Manifest base schemas (core, context, base)

#### [`/src/config/schemas/base/primitives.ts`](../src/config/schemas/base/primitives.ts)

**Purpose**: Basic primitive type schemas.

**Key Schemas**:

- `EmailSchema` - Email address validation
- `KeySchema` - Configuration key validation
- `NameSchema` - Generic name validation
- `DescriptionSchema` - Description text validation
- `BooleanSchema` - Boolean value with default
- `ConfigModeSchema` - Configuration mode ('inline' | 'reference')
- `ISO8601DurationSchema` - ISO 8601 duration format
- `UrlSchema` - URL validation

#### [`/src/config/schemas/base/aws-primitives.ts`](../src/config/schemas/base/aws-primitives.ts)

**Purpose**: AWS-specific primitive type schemas.

**Key Schemas**:

- `AwsRegionSchema` - AWS region validation (e.g., 'us-east-1')
- `AwsAccountIdSchema` - AWS account ID validation (12-digit string)
- `ArnSchema` - AWS ARN format validation
- `ManagedPolicyArnSchema` - AWS managed policy ARN validation
- `ServicePrincipalSchema` - AWS service principal validation

#### [`/src/config/schemas/base/common.ts`](../src/config/schemas/base/common.ts)

**Purpose**: Common schemas used across multiple resource types.

**Key Schemas**:

- `EnvironmentSchema` - Environment validation ('nprd', 'prod', 'mgmt', 'shared', 'pprd')
- `ProjectNameSchema` - Project name validation
- `CompanyNameSchema` - Company name validation
- `TagsSchema` - AWS tags object validation

**Key Types**:

- `Environment` - TypeScript type for environment values
- `ProjectName` - TypeScript type for project names
- `CompanyName` - TypeScript type for company names

#### [`/src/config/schemas/base/manifest-base.ts`](../src/config/schemas/base/manifest-base.ts)

**Purpose**: Base schemas for manifest structure.

**Key Schemas**:

- `ManifestCoreSchema` - Core manifest fields (project, company, owner)
- `ManifestContextSchema` - Context fields (description, tags)
- `ManifestBaseSchema` - Complete base manifest structure

**Key Types**:

- `ManifestCore` - Core manifest fields type
- `ManifestContext` - Context fields type
- `ManifestBase` - Complete base manifest type

---

### Resource Schemas

#### [`/src/config/schemas/resources/index.ts`](../src/config/schemas/resources/index.ts)

**Purpose**: Export point for all AWS resource-specific schemas.

**Key Exports**:

- Account and management schemas
- Organization schemas
- Identity Center schemas
- IAM schemas
- GitHub OIDC schemas
- Deployment permissions schemas
- Project schemas
- Networking schemas
- Security schemas
- Compliance schemas
- Domain management schemas

#### [`/src/config/schemas/resources/accounts.ts`](../src/config/schemas/resources/accounts.ts)

**Purpose**: Account configuration schemas.

**Key Schemas**:

- `AccountConfigSchema` - AWS account configuration
- `ManagementConfigSchema` - Management account configuration
- `DeploymentTargetSchema` - Deployment target configuration

**Key Types**:

- `AccountConfig` - Account configuration type
- `ManagementConfig` - Management account type
- `DeploymentTarget` - Deployment target type

#### [`/src/config/schemas/resources/organizations.ts`](../src/config/schemas/resources/organizations.ts)

**Purpose**: AWS Organizations configuration schemas.

**Key Schemas**:

- `OrganizationalUnitSchema` - Organizational unit configuration
- `OrganizationSchema` - Organization configuration
- `ServiceControlPolicySchema` - SCP configuration

**Key Types**:

- `OrganizationalUnitConfig` - OU configuration type
- `OrganizationConfig` - Organization configuration type
- `ServiceControlPolicy` - SCP type

#### [`/src/config/schemas/resources/identity-center.ts`](../src/config/schemas/resources/identity-center.ts)

**Purpose**: AWS IAM Identity Center (SSO) configuration schemas.

**Key Schemas**:

- `UserConfigSchema` - Identity Center user configuration
- `PermissionSetConfigSchema` - Permission set configuration
- `SSOAssignmentConfigSchema` - SSO assignment configuration
- `IdentityCenterSchema` - Complete Identity Center configuration
- `ApplicationConfigSchema` - Identity Center application configuration

**Key Types**:

- `UserConfig` - User configuration type
- `PermissionSetConfig` - Permission set type
- `SSOAssignmentConfig` - SSO assignment type
- `IdentityCenterConfig` - Identity Center configuration type

#### [`/src/config/schemas/resources/iam.ts`](../src/config/schemas/resources/iam.ts)

**Purpose**: IAM role and policy schemas.

**Key Schemas**:

- `CrossAccountRoleSchema` - Cross-account IAM role configuration
- `IamRoleConfigSchema` - IAM role configuration

**Key Types**:

- `CrossAccountRole` - Cross-account role type
- `IamRoleConfig` - IAM role configuration type

#### [`/src/config/schemas/resources/github-oidc.ts`](../src/config/schemas/resources/github-oidc.ts)

**Purpose**: GitHub OIDC provider configuration schemas.

**Key Schemas**:

- `GitHubOidcSchema` - GitHub OIDC provider configuration

**Key Types**:

- `GitHubOidc` - GitHub OIDC configuration type

#### [`/src/config/schemas/resources/deployment-permissions.ts`](../src/config/schemas/resources/deployment-permissions.ts)

**Purpose**: Deployment permissions configuration schemas.

**Key Schemas**:

- `DeploymentPermissionsSchema` - Deployment permissions configuration

**Key Types**:

- `DeploymentPermissions` - Deployment permissions type

#### [`/src/config/schemas/resources/projects.ts`](../src/config/schemas/resources/projects.ts)

**Purpose**: Project configuration schemas.

**Key Schemas**:

- `ProjectEnvironmentSchema` - Project environment configuration
- `ProjectSchema` - Complete project configuration

**Key Types**:

- `ProjectEnvironment` - Project environment type
- `Project` - Project configuration type

#### [`/src/config/schemas/resources/networking.ts`](../src/config/schemas/resources/networking.ts)

**Purpose**: Networking configuration schemas.

**Key Schemas**:

- `NetworkingConfigSchema` - Networking configuration
- `VpcConfigSchema` - VPC configuration

**Key Types**:

- `NetworkingConfig` - Networking configuration type
- `VpcConfig` - VPC configuration type

#### [`/src/config/schemas/resources/security.ts`](../src/config/schemas/resources/security.ts)

**Purpose**: Security configuration schemas.

**Key Schemas**:

- `SecurityConfigSchema` - Security configuration
- `SecurityGroupConfigSchema` - Security group configuration
- `KmsKeyConfigSchema` - KMS key configuration

**Key Types**:

- `SecurityConfig` - Security configuration type
- `SecurityGroupConfig` - Security group type
- `KmsKeyConfig` - KMS key type

#### [`/src/config/schemas/resources/compliance.ts`](../src/config/schemas/resources/compliance.ts)

**Purpose**: Compliance and governance configuration schemas.

**Key Schemas**:

- `ComplianceConfigSchema` - Compliance configuration
- `CloudTrailConfigSchema` - CloudTrail configuration
- `ConfigServiceConfigSchema` - AWS Config configuration
- `GuardDutyConfigSchema` - GuardDuty configuration
- `SecurityHubConfigSchema` - Security Hub configuration

**Key Types**:

- `ComplianceConfig` - Compliance configuration type
- `CloudTrailConfig` - CloudTrail type
- `ConfigServiceConfig` - AWS Config type
- `GuardDutyConfig` - GuardDuty type
- `SecurityHubConfig` - Security Hub type

#### [`/src/config/schemas/resources/domains.ts`](../src/config/schemas/resources/domains.ts)

**Purpose**: Domain management configuration schemas.

**Key Schemas**:

- `DomainManagementSchema` - Domain management configuration
- `RegisteredDomainSchema` - Registered domain configuration
- `DomainDelegationSchema` - Domain delegation configuration
- `CertificateConfigSchema` - ACM certificate configuration

**Key Types**:

- `DomainManagement` - Domain management type
- `RegisteredDomain` - Registered domain type
- `DomainDelegation` - Domain delegation type
- `CertificateConfig` - Certificate configuration type

---

### Application Schemas

#### [`/src/config/schemas/applications/index.ts`](../src/config/schemas/applications/index.ts)

**Purpose**: Export point for application-level schemas.

**Key Exports**:

- `UnifiedAppConfigSchema` - Single unified application configuration schema
- `ManifestSchema` - Alias for `UnifiedAppConfigSchema` (for backward compatibility)
- Validation functions for unified config

#### [`/src/config/schemas/applications/unified.ts`](../src/config/schemas/applications/unified.ts)

**Purpose**: Single unified application configuration schema supporting all deployment patterns.

**Design Philosophy**:

- **No manifestType field** - Components define what gets deployed, not a type discriminator
- **Component-based approach** - Enable only the components you need
- **Maximum flexibility** - Deploy any combination of components to any account
- **Single-account or multi-environment** - Use `deployment` for single account, `environments` for
  multi-environment

**Key Schemas**:

- `UnifiedAppConfigSchema` - Complete unified application configuration
- `EnvironmentConfigSchema` - Environment-specific configuration (accountId, region, config)

**Key Types**:

- `UnifiedAppConfig` - Unified application configuration type
- `DeploymentTarget` - Deployment target type (imported from base schemas)
- `EnvironmentConfig` - Environment configuration type

**Key Functions**:

- `validateUnifiedAppConfig()` - Validate unified config (throws on error)
- `safeValidateUnifiedAppConfig()` - Validate unified config (returns result)

**Deployment Patterns**:

1. **Single-account deployment** (e.g., management account):

   ```yaml
   project: codeiqlabs
   company: codeiqlabs
   deployment:
     accountId: '682475224767'
     region: us-east-1
   organization:
     enabled: true
   identityCenter:
     enabled: true
   ```

2. **Multi-environment deployment** (e.g., workload application):

   ```yaml
   project: myapp
   company: codeiqlabs
   deployment:
     accountId: '466279485605'
     region: us-east-1
   environments:
     nprd:
       accountId: '466279485605'
       region: us-east-1
     prod:
       accountId: '719640820326'
       region: us-east-1
   networking:
     vpc:
       enabled: true
   ```

3. **Mixed deployment** (management + workload components):
   ```yaml
   project: codeiqlabs
   company: codeiqlabs
   deployment:
     accountId: '682475224767'
     region: us-east-1
   environments:
     nprd:
       accountId: '466279485605'
       region: us-east-1
   organization:
     enabled: true
   networking:
     vpc:
       enabled: true
   ```

**Available Components** (all optional):

- `organization` - AWS Organizations (OUs, SCPs, account management)
- `identityCenter` - AWS Identity Center/SSO (users, permission sets, assignments)
- `domains` - Domain management (DNS, delegation, certificates)
- `deploymentPermissions` - GitHub Actions deployment configuration
- `networking` - VPC and network infrastructure

---

### Schema Validation

#### [`/src/config/schemas/validation/manifest-validators.ts`](../src/config/schemas/validation/manifest-validators.ts)

**Purpose**: Manifest validation utilities and helper functions.

**Key Functions**:

- Manifest structure validation
- Type-specific validation rules
- Error message formatting
- Validation result handling

---

### Constants

#### [`/src/constants/index.ts`](../src/constants/index.ts)

**Purpose**: Main entry point for constants module.

**Key Exports**:

- Environment constants and utilities

#### [`/src/constants/environments.ts`](../src/constants/environments.ts)

**Purpose**: Environment-related constants and validation.

**Key Constants**:

- `ENV_VALUES` - Array of valid environment values: `['nprd', 'prod', 'mgmt', 'shared', 'pprd']`

**Key Functions**:

- `validateEnvironment()` - Validate environment value (throws on invalid)
- `isValidEnvironment()` - Check if value is valid environment (boolean)

**Key Types**:

- `Environment` - TypeScript type for environment values

**Usage**:

```typescript
import { ENV_VALUES, validateEnvironment } from '@codeiqlabs/aws-utils';

const env = validateEnvironment('nprd'); // Valid
// validateEnvironment('invalid'); // Throws error
```

---

### Helpers

#### [`/src/helpers/index.ts`](../src/helpers/index.ts)

**Purpose**: Main entry point for helper utilities.

**Key Exports**:

- Environment variable helpers

#### [`/src/helpers/env.ts`](../src/helpers/env.ts)

**Purpose**: Environment variable handling utilities.

**Key Functions**:

- `getRequiredEnvVar()` - Get required environment variable (throws if missing)
- `getRequiredEnvVarStrict()` - Get required environment variable with strict validation
- `getAccountIdFromEnv()` - Get AWS account ID from environment variable
- `getEnvVarWithDefault()` - Get environment variable with default value

**Key Types**:

- `EnvVarOptions` - Options for environment variable retrieval

**Usage**:

```typescript
import { getRequiredEnvVar, getAccountIdFromEnv } from '@codeiqlabs/aws-utils';

const apiKey = getRequiredEnvVar('API_KEY');
const accountId = getAccountIdFromEnv('PROD_ACCOUNT_ID', 'Production Account');
```

---

### Naming Utilities

#### [`/src/naming/index.ts`](../src/naming/index.ts)

**Purpose**: Main entry point for naming utilities.

**Key Exports**:

- Core naming functions
- `ResourceNaming` convenience class
- Type definitions
- Utility functions

#### [`/src/naming/types.ts`](../src/naming/types.ts)

**Purpose**: Type definitions for naming utilities.

**Key Types**:

- `ProjectName` - Project name type
- `Environment` - Environment type
- `ExtendedEnvironment` - Extended environment type (includes 'pprd')
- `NamingConfig` - Configuration for resource naming
- `NamingProvider` - Interface for naming providers
- `NamingInput` - Input for naming functions
- `ExportNameOptions` - Options for CloudFormation export names
- `IAMNamingOptions` - Options for IAM resource naming
- `S3NamingOptions` - Options for S3 bucket naming
- `ResourceType` - Supported resource types
- `BaseParamOpts` - Base options for SSM parameters
- `StringParamOpts` - Options for string parameters
- `BatchParamOpts` - Options for batch parameter operations

**Key Functions**:

- `resolveNaming()` - Resolve naming configuration from various inputs
- `sanitizeForConstructId()` - Sanitize string for CDK construct IDs

#### [`/src/naming/functions.ts`](../src/naming/functions.ts)

**Purpose**: Core naming functions for AWS resources.

**Key Functions**:

- `generateStackName()` - Generate CDK stack names
- `generateExportName()` - Generate CloudFormation export names
- `generateResourceName()` - Generate generic resource names
- `generateIAMRoleName()` - Generate IAM role names
- `generateS3BucketName()` - Generate S3 bucket names with optional suffix
- `generateDomainName()` - Generate domain names with subdomains
- `generateSSMParameterName()` - Generate SSM parameter names
- `generateStageName()` - Generate CDK stage names with environment validation

**Naming Patterns**:

- **Stack Names**: `{Project}-{Environment}-{StackName}-Stack`
- **Export Names**: `{project}-{environment}-{exportName}`
- **Resource Names**: `{project}-{environment}-{resourceName}`
- **IAM Roles**: `{Project}-{environment}-{roleName}`
- **S3 Buckets**: `{project}-{environment}-{bucketName}[-{suffix}]`
- **SSM Parameters**: `/{Project}/{environment}/{category}/{paramName}`

**Usage**:

```typescript
import { generateStackName, generateS3BucketName } from '@codeiqlabs/aws-utils/naming';

const stackName = generateStackName({ project: 'MyApp', environment: 'prod' }, 'API');
// Result: "MyApp-prod-API-Stack"

const bucketName = generateS3BucketName({ project: 'MyApp', environment: 'prod' }, 'artifacts');
// Result: "myapp-prod-artifacts-abc123"
```

#### [`/src/naming/convenience.ts`](../src/naming/convenience.ts)

**Purpose**: Convenience class for resource naming.

**Key Classes**:

- `ResourceNaming` - Convenience class wrapping naming functions

**Key Methods**:

- `stackName()` - Generate stack name
- `exportName()` - Generate export name
- `resourceName()` - Generate resource name
- `iamRoleName()` - Generate IAM role name
- `s3BucketName()` - Generate S3 bucket name
- `domainName()` - Generate domain name
- `ssmParameterName()` - Generate SSM parameter name
- `standardTags()` - Generate standard tags
- `getConfig()` - Get naming configuration

**Usage**:

```typescript
import { ResourceNaming } from '@codeiqlabs/aws-utils';

const naming = new ResourceNaming({
  project: 'MyApp',
  environment: 'prod',
});

const stackName = naming.stackName('API');
const bucketName = naming.s3BucketName('artifacts');
const tags = naming.standardTags({ owner: 'Platform Team' });
```

---

### Tagging Utilities

#### [`/src/tagging/index.ts`](../src/tagging/index.ts)

**Purpose**: Main entry point for tagging utilities.

**Key Exports**:

- Core tagging functions
- Convenience classes
- Type definitions
- Environment utilities

#### [`/src/tagging/types.ts`](../src/tagging/types.ts)

**Purpose**: Type definitions for tagging utilities.

**Key Types**:

- `EnvironmentTag` - Environment tag value type
- `ExtraTags` - Additional custom tags
- `TaggingOptions` - Options for tag generation
- `StandardTags` - Standard tag structure
- `CodeIQLabsStandardTags` - Deprecated alias for backward compatibility

#### [`/src/tagging/functions.ts`](../src/tagging/functions.ts)

**Purpose**: Core tagging functions.

**Key Functions**:

- `generateStandardTags()` - Generate standard tags for AWS resources
- `getEnvironmentTag()` - Get environment tag value
- `mergeTaggingOptions()` - Merge tagging options with defaults

**Standard Tags**:

- `App` - Application/project name
- `Environment` - Environment (NonProd, Prod, Management, Shared)
- `Owner` - Resource owner
- `Company` - Company name
- `ManagedBy` - Management tool (defaults to 'aws-utils')

**Usage**:

```typescript
import { generateStandardTags } from '@codeiqlabs/aws-utils';

const tags = generateStandardTags(
  { project: 'MyApp', environment: 'prod' },
  { owner: 'Platform Team', company: 'MyCompany' },
);

// Result:
// {
//   App: 'MyApp',
//   Environment: 'Prod',
//   Owner: 'Platform Team',
//   Company: 'MyCompany',
//   ManagedBy: 'aws-utils'
// }
```

#### [`/src/tagging/convenience.ts`](../src/tagging/convenience.ts)

**Purpose**: Convenience utilities for tagging.

**Key Classes/Functions**:

- Convenience wrappers for common tagging operations
- Integration with naming utilities

---

## `/schemas` - JSON Schema Files

**Purpose**: JSON Schema files for IDE integration and validation.

**Schema File**:

1. [`schemas/manifest.schema.json`](../schemas/manifest.schema.json) - **Single unified schema for
   all deployment patterns**
   - Component-based configuration (no manifestType discriminator)
   - Supports single-account and multi-environment deployments
   - All component sections are optional
   - Enhanced error messages and strict validation
   - Optimized primitive definitions for AWS resources

**Usage**:

- Hosted on GitHub for IDE autocomplete
- Referenced in VS Code and IntelliJ IDEA configurations
- Automatically generated from Zod schemas using `zod-to-json-schema`
- Updated with each package release
- Provides real-time validation and autocomplete in supported IDEs

**Schema URL**:

```
https://schemas.codeiqlabs.dev/aws/manifest.schema.json
```

---

## `/scripts` - Build and Utility Scripts

#### [`/scripts/generate-schemas.ts`](../scripts/generate-schemas.ts)

**Purpose**: Script to generate JSON Schema files from Zod schemas.

**Key Responsibilities**:

- Convert Zod schemas to JSON Schema format
- Generate individual schema files for each manifest type
- Create unified schema with discriminated unions
- Write schema files to `/schemas` directory

**Usage**:

```bash
npm run generate-schemas
```

---

## `/tests` - Test Files

#### [`/tests/load-config.test.cjs`](../tests/load-config.test.cjs)

**Purpose**: CommonJS import tests for configuration loading.

**Key Tests**:

- Test CommonJS module imports
- Validate configuration loading in CJS environment
- Ensure backward compatibility

#### [`/tests/esm-import-test.mjs`](../tests/esm-import-test.mjs)

**Purpose**: ESM import tests for all modules.

**Key Tests**:

- Test ESM module imports
- Validate all exported functions and classes
- Ensure dual module support works correctly

---

## Package Architecture

### Module Organization

The package is organized into logical modules with clear separation of concerns:

1. **Application Layer** - CDK bootstrap utilities
2. **CLI Tools** - Command-line utilities for developers
3. **Configuration Layer** - YAML loading and schema validation
4. **Constants** - Shared constants and enumerations
5. **Helpers** - Utility functions for common tasks
6. **Naming Utilities** - Resource naming standardization
7. **Tagging Utilities** - Tag generation and management

### Export Strategy

The package uses a multi-level export strategy:

1. **Main Export** (`@codeiqlabs/aws-utils`) - Most commonly used utilities
2. **Subpath Exports** - Specialized modules:
   - `@codeiqlabs/aws-utils/naming` - Naming utilities
   - `@codeiqlabs/aws-utils/tagging` - Tagging utilities
   - `@codeiqlabs/aws-utils/constants` - Constants
   - `@codeiqlabs/aws-utils/config` - Configuration utilities

### Dual Module Support

The package supports both ESM and CommonJS:

- **ESM**: `dist/index.js` - Modern ES modules
- **CommonJS**: `dist/index.cjs` - Legacy CommonJS
- **Types**: `dist/index.d.ts` - TypeScript declarations

Built using **tsup** for optimal bundle size and compatibility.

---

## Key Design Patterns

### Schema-Driven Configuration

All configuration is validated using Zod schemas:

- Type-safe configuration handling
- Comprehensive validation with detailed error messages
- Automatic TypeScript type inference
- JSON Schema generation for IDE support

### Single Unified Manifest Schema

Component-based configuration without type discriminators:

- **No manifestType field** - Components define what gets deployed
- **Component-based approach** - Enable only the components you need (organization, identityCenter,
  domains, etc.)
- **Flexible deployment patterns**:
  - Single-account deployments using `deployment` field
  - Multi-environment deployments using `environments` field
  - Mixed deployments combining both approaches
- **Maximum flexibility** - Deploy any combination of components to any account
- **Simplified type handling** - Single `UnifiedAppConfig` type for all scenarios
- **Better IDE support** - Enhanced autocomplete with component-specific validation
- **Backward compatible** - Legacy shim files reference the unified schema

### Framework-Agnostic Design

Core utilities are framework-agnostic:

- No CDK dependencies in aws-utils
- CDK-specific functionality moved to `@codeiqlabs/aws-cdk`
- Reusable across different infrastructure tools
- Clean separation of concerns

---

## Related Packages

- **`@codeiqlabs/aws-cdk`** - CDK-specific utilities and constructs
- **`@codeiqlabs/eslint-prettier-config`** - Shared linting and formatting configuration

---

## Summary

The `@codeiqlabs/aws-utils` package provides a comprehensive set of utilities for AWS infrastructure
projects:

- **39 TypeScript source files** organized into 7 logical modules
- **Dual ESM/CommonJS support** for maximum compatibility
- **Single unified manifest schema** - Component-based configuration without type discriminators
- **Comprehensive Zod schemas** for type-safe configuration with enhanced validation
- **CLI tools** for developer productivity (IntelliSense setup, etc.)
- **JSON Schema generation** for IDE integration with real-time validation
- **Framework-agnostic design** for reusability across different infrastructure tools

This package serves as the foundation for all CodeIQLabs AWS infrastructure projects, providing
standardized patterns for naming, tagging, configuration, and validation. The unified manifest
approach enables maximum flexibility by allowing any combination of components to be deployed to any
account.
