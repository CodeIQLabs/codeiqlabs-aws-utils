/**
 * @codeiqlabs/aws-utils
 *
 * Standardized AWS utilities for CodeIQLabs projects
 */

// Constants (environment values, etc.)
export * from './constants/index';

// Helper utilities (environment variables, validation, etc.)
export * from './helpers';

// CDK-specific utilities have been moved to @codeiqlabs/aws-cdk package

// Configuration utilities (YAML loading, schema validation, etc.)
// Note: Config module exports are available via '@codeiqlabs/aws-utils/config' subpath
// Only re-export the most commonly used config utilities here to avoid conflicts
export {
  loadConfig,
  loadManagementManifest,
  loadWorkloadManifest,
  validateConfig,
  expandEnvironmentVariables,
} from './config';

// Export commonly used config types for CDK constructs
export type {
  PermissionSetConfig,
  SSOAssignmentConfig,
  OrganizationalUnitConfig,
  ConfigMode,
  AccountConfig,
  DeploymentPermissions,
  Project,
  ProjectEnvironment,
  CrossAccountRole,
  GitHubOidc,
} from './config';

// Export commonly used naming types for CDK constructs
export type { NamingConfig, BaseParamOpts, StringParamOpts, BatchParamOpts } from './naming';

// Stage name generation utility for enforcing environment constants
export { generateStageName } from './naming';

// Reusable centralized configuration module
// @deprecated Will be moved to @codeiqlabs/aws-customization in v2.0.0
// export * from "./customization-config";

// Naming utilities (also available via subpath '@codeiqlabs/aws-utils/naming')
export * from './naming/index';

// Tagging utilities (also available via subpath '@codeiqlabs/aws-utils/tagging')
export * from './tagging/index';

// Package version and metadata
export const VERSION = '1.1.0';
export const PACKAGE_NAME = '@codeiqlabs/aws-utils';
