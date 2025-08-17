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

/**
 * Convenience re-exports for commonly used application schemas
 */
export { ManagementAppConfigSchema } from './management';

export { WorkloadAppConfigSchema } from './workload';

/**
 * Convenience re-exports for commonly used application types
 */
export type { ManagementAppConfig } from './management';

export type { WorkloadAppConfig } from './workload';
