# @codeiqlabs/aws-utils

## 1.6.0

### Minor Changes

- f49df18: Update eslint-prettier-config and remove deprecated functions
  - Update `@codeiqlabs/eslint-prettier-config` to ^1.6.0 for improved JavaScript file handling
  - Remove deprecated loader functions: `validateConfig`, `loadManagementManifest`,
    `loadWorkloadManifest`
  - Clean up unused imports in config modules (glob, join from path)
  - Streamline configuration loading utilities for better maintainability
  - Remove unused dependencies and simplify module structure

  This release improves compatibility with the latest ESLint configuration and removes legacy
  functions that are no longer needed.

## 1.4.0

### Minor Changes

- 84ff4a9: Add baseline application schema for foundational infrastructure

  This release introduces a new fourth application schema type for CodeIQLabs AWS projects:

  **New Features:**
  - **BaselineAppConfigSchema**: Complete foundational infrastructure configuration for workload
    accounts
  - **NetworkingConfigSchema**: Comprehensive VPC, subnet, routing, and gateway configurations
  - **SecurityConfigSchema**: Security groups, NACLs, IAM roles, KMS keys, and Session Manager setup
  - **ComplianceConfigSchema**: CloudTrail, Config, GuardDuty, Security Hub, Inspector, and Access
    Analyzer

  **Schema Architecture:** The CodeIQLabs configuration system now supports four application types:
  1. `management` - AWS Organizations, Identity Center, cross-account management
  2. `shared-services` - Centralized services (monitoring, Transit Gateway)
  3. `workload` - Application-specific infrastructure deployment
  4. `baseline` - Foundational infrastructure (VPC, security, compliance) ✨ **NEW**

  **Deployment Sequence:**

  ```
  1. Management Account → ManagementAppConfigSchema
  2. Shared Services Account → SharedServicesAppConfigSchema
  3. Workload Accounts → BaselineAppConfigSchema (first)
  4. Workload Accounts → WorkloadAppConfigSchema (second)
  ```

  **Key Benefits:**
  - Consistent networking and security foundations across all workload accounts
  - Comprehensive compliance and monitoring setup out of the box
  - Type-safe configuration with full TypeScript support and IntelliSense
  - Modular design allows customization while maintaining standards

  **Breaking Changes:** None - this is a purely additive feature

  **JSON Schema Support:**
  - New `baseline-manifest.schema.json` for IntelliSense support
  - Updated `manifest.schema.json` to include baseline configuration type
  - All existing schemas remain unchanged and fully compatible

## 1.3.0

### Minor Changes

- aff5d3b: feat: Add automated IntelliSense setup for manifest files

  This release introduces a comprehensive automated IntelliSense setup system that provides seamless
  autocomplete, validation, and hover documentation for CodeIQLabs manifest files in both VS Code
  and IntelliJ IDEA.

  ## New Features

  ### 🔧 CLI Tool for IntelliSense Setup
  - Added `npx @codeiqlabs/aws-utils setup-intellisense` command
  - Auto-detects manifest types (management/workload/shared)
  - Configures both VS Code and IntelliJ IDEA automatically
  - Cross-platform compatibility (Windows, macOS, Linux)

  ### 📋 JSON Schema Generation
  - Automated generation of JSON Schema files from Zod schemas
  - HTTP-based schema distribution for reliable cross-editor support
  - Real-time validation and error reporting
  - Contextual autocomplete suggestions

  ### 🎯 Enhanced Schema Structure
  - Fixed schema hierarchy to match actual YAML structure
  - Properties now appear in correct contextual locations
  - Improved validation with detailed error messages
  - Support for nested property autocomplete

  ### 🌐 HTTP Schema Distribution
  - Schemas hosted via GitHub raw URLs for universal access
  - Eliminates local file path resolution issues
  - Always up-to-date schemas without manual updates
  - Works reliably across all IDEs and environments

  ## Developer Experience Improvements
  - **Zero Setup**: Install package + run CLI = IntelliSense works
  - **No File Copying**: Schemas referenced directly from package
  - **Clean Projects**: No schema files cluttering repositories
  - **Automatic Updates**: Latest schemas always available
  - **Universal Compatibility**: Works in any environment with internet access

  ## Breaking Changes

  None. This is a purely additive feature that enhances the existing manifest system.

  ## Usage

  ```bash
  # Install the package
  npm install @codeiqlabs/aws-utils

  # Set up IntelliSense
  npx @codeiqlabs/aws-utils setup-intellisense

  # Restart your editor and enjoy full IntelliSense support!
  ```

  ## Technical Details
  - Added CLI infrastructure with TypeScript support
  - Enhanced build system with dual ESM/CJS output
  - Improved schema validation with contextual error messages
  - HTTP-based schema distribution for maximum compatibility
  - Support for multiple manifest types with auto-detection

## 1.2.0

### Minor Changes

- 98ad122: feat: implement automated release infrastructure with dual module publishing
  - Added @changesets/cli for automated version management and release notes
  - Implemented dual ESM/CJS publishing with conditional exports for maximum compatibility
  - Added comprehensive GitHub Actions CI/CD workflows for pull request validation and automated
    releases
  - Integrated Husky pre-commit hooks with lint-staged for automatic code quality enforcement
  - Added comprehensive test suite validating both ESM and CJS module loading
  - Updated package.json with changeset-related scripts and enhanced build process
  - Added TypeScript configurations for dual builds (tsconfig.esm.json, tsconfig.cjs.json)
  - Enhanced documentation with contributing guidelines and release process documentation
  - Configured publishing to GitHub Packages with proper authentication and permissions

  This establishes the same sophisticated centralized code quality infrastructure used in the
  eslint-prettier-config repository, ensuring consistent development workflows and automated quality
  enforcement across all CodeIQLabs packages.

### Patch Changes

- a16e986: fix: configure GitHub Packages authentication for CI/CD workflows
  - Updated dependency reference from local file path to published GitHub Package Manager version
    ^1.4.1
  - Added .npmrc configuration for GitHub Packages registry authentication
  - Updated all GitHub Actions workflows (ci.yml, release.yml) to properly authenticate with GitHub
    Packages during npm install
  - Added NODE_AUTH_TOKEN environment variable to all dependency installation steps
  - Configured registry-url and scope for @codeiqlabs packages in workflow Node.js setup

  This ensures CI/CD pipelines can successfully install the centralized eslint-prettier-config
  package from GitHub Packages rather than relying on local file references.

- c4f913a: fix: update eslint-prettier-config to v1.5.0 with modular architecture
  - Updated @codeiqlabs/eslint-prettier-config dependency from ^1.4.1 to ^1.5.0
  - Resolves ESLint 9.x compatibility issues with React plugin dependencies
  - Benefits from new modular configuration architecture with proper separation of concerns
  - Minimal configuration now has zero React dependencies, eliminating dependency conflicts
  - Enhanced TypeScript rules and better error handling for missing dependencies

  This resolves the ERESOLVE dependency conflicts that were preventing npm ci from succeeding.

- ee2c226: fix: use custom GH_TOKEN for GitHub Packages authentication
  - Replaced GITHUB_TOKEN with GH_TOKEN secret for all npm package installations
  - The automatic GITHUB_TOKEN has limited permissions and cannot read packages from other
    repositories
  - GH_TOKEN is a custom Personal Access Token with proper read:packages permission
  - Updated all workflow jobs (CI and release) to use the custom token
  - This resolves the persistent 403 Forbidden errors when accessing
    @codeiqlabs/eslint-prettier-config

  The custom GH_TOKEN secret has the necessary permissions: read:packages, write:packages,
  delete:packages, and repo access.
