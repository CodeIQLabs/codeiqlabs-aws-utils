# @codeiqlabs/aws-utils

Standardized AWS utilities for CodeIQLabs projects including resource naming, configuration
validation, and environment management.

## Features

- **Resource Naming**: Consistent naming patterns across all AWS resources
- **Configuration Validation**: Zod schemas for validating YAML configuration files
- **Environment Management**: Standardized environment handling (np, prod, mgmt, shared)
- **Tagging Utilities**: Automated tagging for compliance and resource management
- **Helper Functions**: Common utilities for environment variables and validation

## Installation

```bash
npm install @codeiqlabs/aws-utils
```

## Configuration Schemas

The package provides comprehensive Zod schemas for validating CodeIQLabs project configurations. The
schemas are organized following **AWS CDK resource alignment** with clear separation between
application-level and resource-level configurations.

### Schema Organization

Our schemas are organized into two main categories for better maintainability and intuitive usage:

#### Application Configuration Schemas (`app-schemas/`)

High-level application configurations that combine multiple resource schemas:

- **`management-app.ts`** - Complete management account configuration (`ManagementAppConfigSchema`)
- **`workload-app.ts`** - Complete workload account configuration (`WorkloadAppConfigSchema`)

#### AWS Resource Schemas (`resource-schemas/`)

AWS resource-specific schemas following CDK resource structure:

**Core Foundation:**

- **`base.ts`** - Core validation primitives (environments, regions, account IDs, etc.)
- **`aws.ts`** - Generic AWS resource schemas (ARNs, policies, tags, etc.)

**AWS Service-Specific Schemas:**

- **`organization.ts`** - AWS Organizations resources (OUs, accounts, SCPs)
- **`identity-center.ts`** - AWS Identity Center/SSO resources (permission sets, assignments)
- **`projects.ts`** - Project and environment configuration schemas
- **`iam.ts`** - IAM resources (cross-account roles, policies)
- **`github-oidc.ts`** - GitHub OIDC provider configurations for CI/CD
- **`deployment-permissions.ts`** - Complete deployment permission setups

### Design Principles

1. **CDK Resource Alignment** - Each schema file corresponds to specific AWS services/resources that
   developers work with
2. **Single Responsibility** - Each file handles one specific domain or AWS service
3. **Granular Imports** - Import only the schemas you need:
   `import { CrossAccountRoleSchema } from '@codeiqlabs/aws-utils/config/schemas/iam'`
4. **Backward Compatibility** - All existing exports remain available through the main index
5. **Duplicate Elimination** - Centralized validation patterns (no inline regex duplicates)

### Usage Examples

```typescript
// Import application schemas
import { ManagementAppConfigSchema } from '@codeiqlabs/aws-utils/config/app-schemas/management-app';
import { WorkloadAppConfigSchema } from '@codeiqlabs/aws-utils/config/app-schemas/workload-app';

// Import specific resource schemas
import { ProjectSchema } from '@codeiqlabs/aws-utils/config/resource-schemas/projects';
import { CrossAccountRoleSchema } from '@codeiqlabs/aws-utils/config/resource-schemas/iam';

// Or import from main config index
import {
  ProjectSchema,
  CrossAccountRoleSchema,
  WorkloadAppConfigSchema,
} from '@codeiqlabs/aws-utils/config';

// Validate configuration
const projectConfig = ProjectSchema.parse(yamlData);
const workloadConfig = WorkloadAppConfigSchema.parse(manifestData);
```

## Resource Naming

```typescript
import { ResourceNaming } from '@codeiqlabs/aws-utils/naming';

const naming = new ResourceNaming({
  project: 'BudgetTrack',
  environment: 'np',
});

const stackName = naming.stackName('DeploymentPermissions');
// Result: "BudgetTrack-np-DeploymentPermissions-Stack"
```

## Environment Management

```typescript
import { getAccountIdFromEnv } from '@codeiqlabs/aws-utils';

const accountId = getAccountIdFromEnv('BUDGETTRACK_NP_ACCOUNT', 'BudgetTrack NP');
```

## Module Formats

This package supports both ESM and CommonJS with dual publishing:

### ESM (Recommended)

```typescript
import { ResourceNaming } from '@codeiqlabs/aws-utils';
import { ENV_VALUES } from '@codeiqlabs/aws-utils/constants';
```

### CommonJS

```javascript
const { ResourceNaming } = require('@codeiqlabs/aws-utils');
const { ENV_VALUES } = require('@codeiqlabs/aws-utils/constants');
```

## Development

```bash
# Install dependencies
npm install

# Build the package (dual ESM/CJS)
npm run build

# Run tests
npm run test:all

# Lint the code
npm run lint

# Format the code
npm run format

# Create a changeset for your changes
npm run changeset
```

## Contributing

This package uses automated release management with changesets and enforced code quality:

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Update source files in `src/`
   - Add tests if applicable
   - Update documentation

3. **Test your changes**
   ```bash
   npm run build
   npm run test:all
   npm run format:check
   ```

4. **Create a changeset**
   ```bash
   npm run changeset
   ```
   - Select the appropriate change type (patch/minor/major)
   - Write a clear, descriptive summary

5. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - The CI workflow will automatically validate your changes
   - Ensure you have included a changeset file
   - Wait for review and approval

### Release Process

The release process is fully automated:

1. **Pull Request Merged** → Triggers release workflow
2. **Changesets Action** either:
   - Creates/updates a "Version Packages" PR (if changesets exist)
   - Publishes the package (if Version Packages PR was merged)

### Pre-commit Hooks

This repository uses Husky and lint-staged to automatically:
- Run ESLint and fix issues
- Format code with Prettier
- Validate TypeScript compilation

### Schema Development Guidelines

When adding new schemas:

1. **Follow CDK alignment** - Create new files that correspond to AWS services
2. **Use centralized validation** - Import base schemas instead of creating inline regex
3. **Maintain backward compatibility** - Export new schemas through the main index
4. **Document your changes** - Update this README with new schema files

## Versioning & Releases

We use Changesets with SemVer:

- **patch**: Bug fixes, documentation updates, internal refactoring
- **minor**: New features, new utilities, additive changes
- **major**: Breaking changes, removed features, changed APIs

Publishing targets GitHub Packages. Consumers pulling from GitHub Packages must configure their `.npmrc` accordingly.

## License

MIT
