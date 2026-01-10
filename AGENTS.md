---
trigger: always_on
---

## Purpose

Framework-agnostic AWS utilities library providing the foundation for all CodeIQLabs infrastructure. Provides:
- **Schema-driven configuration** - Zod schemas for AWS manifests using convention-over-configuration (presence implies enabled)
- **SaaS application schemas** - `saasEdge` (CloudFront/S3) and `saasWorkload` (ECS/Aurora) for multi-brand deployments
- **Standardized resource naming** - Consistent naming for stacks, S3 buckets, IAM roles, SSM parameters, domains
- **Consistent tagging** - Environment-aware tag generation with standard tag sets
- **Environment variable helpers** - Strict validation and type-safe environment access
- **CLI tools** - IDE IntelliSense setup with JSON Schema support
- **Dual module support** - ESM + CommonJS for maximum compatibility

## Current State

Active and stable. Published to GitHub Packages. Used as the foundation layer for all CodeIQLabs infrastructure.

**Package**: `@codeiqlabs/aws-utils`
**Version**: ![GitHub package.json version](https://img.shields.io/github/package-json/v/CodeIQLabs/codeiqlabs-aws-utils?label=version)

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                  @codeiqlabs/aws-utils                       │
│                  (Foundation Layer)                          │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Schemas    │  │    Naming    │  │   Tagging    │      │
│  │              │  │              │  │              │      │
│  │ Zod schemas  │  │ Stack names  │  │ Standard     │      │
│  │ Validation   │  │ S3 buckets   │  │ tags         │      │
│  │ Manifests    │  │ IAM roles    │  │ Environment  │      │
│  │              │  │ SSM params   │  │ aware        │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Helpers    │  │  Constants   │  │     CLI      │      │
│  │              │  │              │  │              │      │
│  │ Env vars     │  │ ENV_VALUES   │  │ IntelliSense │      │
│  │ Validation   │  │              │  │ setup        │      │
│  │              │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ (consumed by)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  CodeIQLabs Infrastructure Repositories                      │
│  - @codeiqlabs/aws-cdk (CDK constructs layer)               │
│  - codeiqlabs-management-aws (Organizations, SSO)           │
│  - codeiqlabs-customization-aws (CloudFront, VPC Origins)   │
│  - codeiqlabs-saas-aws (ECS, Aurora, Secrets)               │
└─────────────────────────────────────────────────────────────┘
```

## Quick Start

### Development

```bash
# Install dependencies
pnpm install

# Build the package
pnpm run build

# Run tests
pnpm run test:all

# Generate JSON schemas for IDE IntelliSense
pnpm run generate-schemas

# Lint and format
pnpm run lint
pnpm run format:check
```

### Publishing (Automated via CI)

The release workflow is automated via GitHub Actions using `changesets/action`:

1. **Create a changeset** describing your changes:
   ```bash
   pnpm changeset
   ```

2. **Commit and push** the changeset file along with your code changes

3. **CI opens a "Version Packages" PR** automatically when changesets are detected on `main`

4. **Merge the "Version Packages" PR** when ready to release - CI will:
   - Bump `package.json` version
   - Update `CHANGELOG.md`
   - Publish to GitHub Packages
   - Create a Git tag

> **⚠️ Important**: Do NOT run `pnpm changeset:version` locally or manually bump `package.json` - the CI pipeline handles versioning automatically.

### Consuming in Other Repos

```bash
# Install the package
pnpm add @codeiqlabs/aws-utils

# Use in code
import { generateStackName, ResourceNaming, loadManifest } from '@codeiqlabs/aws-utils';
```

### Local Development (File References)

When developing locally, use file references to ensure you're using the latest local code:

```json
{
  "dependencies": {
    "@codeiqlabs/aws-utils": "file:../codeiqlabs-aws-utils"
  }
}
```

After rebuilding aws-utils, reinstall dependencies in consuming repos:

```bash
cd ../codeiqlabs-aws-utils && pnpm run build
cd ../codeiqlabs-aws-cdk && rm -rf node_modules pnpm-lock.yaml && pnpm install
```

## Dependencies

**Peer Dependencies**:
- `aws-cdk-lib` 2.213.0
- `constructs` ^10.0.0
- `typescript` >=5.4.0 <6.0.0

**Core Dependencies**:
- `zod` ^3.25.76 - Schema validation
- `js-yaml` ^4.1.0 - YAML parsing
- `glob` ^11.0.3 - File pattern matching

## Gotchas

- **Always rebuild before testing** - Tests run against compiled `dist/` output, not source
- **Use file references for local dev** - Don't rely on published versions during development
- **Schemas are generated** - Run `pnpm run generate-schemas` after schema changes
- **Dual builds required** - Must build both ESM and CJS for compatibility
- **Version dependencies carefully** - This is the foundation; breaking changes cascade
- **pnpm-lock.yaml is tracked** - Switched from npm to pnpm for consistency
- **Presence implies enabled** - No `enabled: true` flags in schemas; if a section exists, it's deployed
- **environments is required** - Replaced `deployment` field; use `environments.mgmt` for single-account repos
- **skipEnvironment for single-account repos** - Use `naming.skipEnvironmentName: true` or `stackName('Foo', { skipEnvironment: true })`
- **Identity Center assignments use compact format** - `{ accountKey: { permissionSet: [userKeys] } }` instead of array
- **GitHub OIDC uses targetEnvironments** - String array referencing environment keys, not inline environment objects

## Architecture Decisions

### Framework-Agnostic Design
- **Why**: Allow use in CDK, Terraform, Pulumi, or raw AWS SDK
- **How**: No CDK dependencies in core utilities; only peer dependencies
- **Trade-off**: More verbose API, but broader compatibility

### Convention-over-Configuration (v1.10.0)
- **Why**: Reduce manifest verbosity; `enabled: true` on every section is noise
- **How**: Presence of a section implies it's enabled; no explicit flags needed
- **Trade-off**: Can't disable a section without removing it entirely

### SaaS Edge/Workload Split (v1.10.0)
- **Why**: Clear separation between management account (CloudFront, S3) and workload accounts (ECS, Aurora)
- **How**: `saasEdge` for customization-aws, `saasWorkload` for saas-aws
- **Trade-off**: Two sections instead of one, but clearer ownership

### Zod for Schema Validation
- **Why**: Runtime validation with TypeScript type inference
- **How**: Define schemas once, get both runtime validation and TypeScript types
- **Trade-off**: Larger bundle size, but type safety and validation in one

### Dual ESM/CJS Builds
- **Why**: Support both modern ESM projects and legacy CJS projects
- **How**: tsup builds both formats with proper package.json exports
- **Trade-off**: More complex build process, but broader compatibility

### Subpath Exports
- **Why**: Allow consumers to import only what they need
- **How**: Export specialized modules like `/naming`, `/tagging`, `/config`
- **Trade-off**: More complex package.json, but better tree-shaking

### Generated JSON Schemas
- **Why**: Enable IDE IntelliSense for YAML/JSON manifests
- **How**: Use zod-to-json-schema to generate from Zod schemas
- **Trade-off**: Extra build step, but excellent developer experience

### ResourceNaming Convenience Class
- **Why**: Reduce boilerplate when generating multiple resource names
- **How**: Class that holds context (project, environment, region, accountId)
- **Trade-off**: OOP pattern in functional codebase, but much more ergonomic

### Skip Environment in Stack Names (v1.10.0)
- **Why**: Single-account repos (management-aws) don't need environment in stack names
- **How**: `skipEnvironment: true` option in `generateStackName()` and `naming.skipEnvironmentName`
- **Trade-off**: Extra option to remember, but cleaner stack names

## Anti-Patterns

❌ **Don't add CDK-specific code here** - Use `@codeiqlabs/aws-cdk` for CDK constructs
❌ **Don't publish without running tests** - `prepublishOnly` script prevents this
❌ **Don't manually edit version numbers** - Use changesets workflow; CI handles versioning
❌ **Don't run `pnpm changeset:version` locally** - CI runs this automatically when merging the "Version Packages" PR
❌ **Don't hardcode versions in documentation** - Use dynamic badges or reference `package.json`
❌ **Don't skip the build step** - Tests and publishing require compiled output
❌ **Don't commit dist/ or schemas/ to git** - Build artifacts are generated, not source
