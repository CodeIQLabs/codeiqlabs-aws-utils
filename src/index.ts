/**
 * @codeiqlabs/aws-utils
 *
 * Standardized AWS utilities for CodeIQLabs projects
 */

// Constants (environment values, etc.)
export * from './constants/index';

// Helper utilities (environment variables, validation, etc.)
export * from './helpers';

// Application utilities for CDK bootstrap
export * from './application';

// CDK-specific utilities have been moved to @codeiqlabs/aws-cdk package

// Configuration utilities (YAML loading, schema validation, etc.)
// Note: Config module exports are available via '@codeiqlabs/aws-utils/config' subpath
// Only re-export the most commonly used config utilities here to avoid conflicts
export {
  loadConfig,
  expandEnvironmentVariables,
  // Generic loaders with auto-detection
  loadManifest,
  isManifestFile,
} from './config';

// Export commonly used configuration types
export type {
  // Unified application config
  UnifiedAppConfig,
  DeploymentTarget,
  EnvironmentConfig,
  ManagementConfig,
  OrganizationConfig,
  IdentityCenterConfig,
  // Generic loader types
  ManifestFormat,
  ManifestLoadResult,
  ManifestLoadError,
  ManifestResult,
  LoadManifestOptions,
} from './config';

// Export commonly used config types for CDK constructs
export type {
  PermissionSetConfig,
  SSOAssignmentConfig,
  UserConfig,
  OrganizationalUnitConfig,
  ConfigMode,
  AccountConfig,
  AlbOriginDiscovery,
  GitHubDeployPermissions,
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
