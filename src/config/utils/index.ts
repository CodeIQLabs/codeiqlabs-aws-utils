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
  // Generic loaders with auto-detection
  loadManifest,
  loadManifests,
  loadManifestsByType,
  isManifestFile,
  // Specific schema loaders (legacy)
  loadConfig,
  loadManagementManifest,
  loadWorkloadManifest,
  validateConfig,
  expandEnvironmentVariables,
} from './loaders';

/**
 * Re-export types for convenience
 */
export type {
  ManifestFormat,
  ManifestLoadResult,
  ManifestLoadError,
  ManifestResult,
  LoadManifestOptions,
} from './loaders';
