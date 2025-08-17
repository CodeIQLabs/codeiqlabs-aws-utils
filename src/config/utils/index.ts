/**
 * Configuration utility functions for CodeIQLabs AWS projects
 *
 * This module provides utility functions for loading, parsing, and validating
 * configuration files. These utilities are separate from schema definitions
 * to maintain clear separation of concerns.
 */

// Re-export all loader utilities
export * from './loaders';

/**
 * Convenience re-exports for the most commonly used utilities
 */
export {
  loadConfig,
  loadManagementManifest,
  loadWorkloadManifest,
  validateConfig,
  expandEnvironmentVariables,
} from './loaders';
