/**
 * Application configuration schemas for CodeIQLabs AWS projects
 *
 * This module provides high-level application configuration schemas that
 * combine multiple resource schemas into complete application configurations.
 */

// Re-export management application schemas
export * from './management';

// Re-export workload application schemas
export * from './workload';

// Re-export shared services application schemas
export * from './shared-services';

// Re-export baseline application schemas
export * from './baseline';

/**
 * Convenience re-exports for commonly used application schemas
 */
export {
  ManagementAppConfigSchema,
  validateManagementAppConfig,
  safeValidateManagementAppConfig,
} from './management';

export {
  WorkloadAppConfigSchema,
  validateWorkloadAppConfig,
  safeValidateWorkloadAppConfig,
} from './workload';

export {
  SharedServicesAppConfigSchema,
  validateSharedServicesAppConfig,
  safeValidateSharedServicesAppConfig,
} from './shared-services';

export {
  BaselineAppConfigSchema,
  validateBaselineAppConfig,
  safeValidateBaselineAppConfig,
} from './baseline';

/**
 * Convenience re-exports for commonly used application types
 */
export type { ManagementAppConfig } from './management';

export type { WorkloadAppConfig } from './workload';

export type { SharedServicesAppConfig } from './shared-services';

export type { BaselineAppConfig } from './baseline';
