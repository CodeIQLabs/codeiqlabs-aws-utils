/**
 * Configuration utilities for CodeIQLabs AWS projects
 *
 * This module provides standardized configuration loading, validation,
 * and schema utilities that can be used across all CodeIQLabs projects.
 *
 * Features:
 * - YAML configuration file loading with environment variable expansion
 * - Comprehensive Zod schema validation
 * - Modular schema components organized by category (base, resources, applications)
 * - Type-safe configuration handling
 * - Detailed error reporting and validation messages
 */

// Utility functions
export * from './utils';

// Schema definitions
export * from './schemas';

// Convenience re-exports for the most commonly used items
export {
  // Core loading functions
  loadConfig,
  expandEnvironmentVariables,
  // Generic loaders with auto-detection
  loadManifest,
  isManifestFile,
  // Convenience alias
  loadConfig as load,
} from './utils';

export {
  // Most commonly used schemas
  EnvironmentSchema,
  ProjectNameSchema,
  CompanyNameSchema,
  AwsAccountIdSchema,
  AwsRegionSchema,
  AccountConfigSchema,
  ManagementConfigSchema,
  OrganizationSchema,
  IdentityCenterSchema,
  ManagementAppConfigSchema,
  WorkloadAppConfigSchema,
  SharedServicesAppConfigSchema,
  BaselineAppConfigSchema,
} from './schemas';

export {
  // Application schema aliases
  ManagementAppConfigSchema as ManagementApp,
  WorkloadAppConfigSchema as WorkloadApp,
  SharedServicesAppConfigSchema as SharedServicesApp,
  BaselineAppConfigSchema as BaselineApp,
} from './schemas/applications';

// Most commonly used types
export type {
  Environment,
  ProjectName,
  CompanyName,
  AwsRegion,
  AwsAccountId,
  AccountConfig,
  ManagementConfig,
  OrganizationConfig,
  IdentityCenterConfig,
  ManagementAppConfig,
  WorkloadAppConfig,
  SharedServicesAppConfig,
  BaselineAppConfig,
} from './schemas';
