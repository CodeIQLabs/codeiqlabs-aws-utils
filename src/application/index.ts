/**
 * Application Utilities for CDK Bootstrap
 *
 * This module provides enhanced utilities specifically designed for CDK application
 * bootstrap scenarios, including manifest loading, configuration transformation,
 * and validation utilities.
 *
 * Key exports:
 * - initializeApp: Enhanced manifest loading with validation
 * - ManifestConfigAdapter: Configuration transformation utilities
 * - Types: Application-specific type definitions
 *
 * @example
 * ```typescript
 * import { initializeApp, ManifestConfigAdapter } from '@codeiqlabs/aws-utils/application';
 *
 * // Load and validate manifest
 * const result = await initializeApp('src/manifest.yaml', {
 *   expectedType: 'management'
 * });
 *
 * if (result.success) {
 *   // Transform to stack configuration
 *   const stackConfig = ManifestConfigAdapter.toManagementConfig(result.data);
 * }
 * ```
 */

// Enhanced manifest loading
export { initializeApp } from './manifest-loader';
export type {
  ApplicationManifestConfig,
  ApplicationManifestResult,
  InitializeAppOptions,
} from './manifest-loader';

// Configuration adapters
export { ManifestConfigAdapter } from './config-adapters';
export type {
  ManagementBaseStackConfig,
  WorkloadBaseStackConfig,
  SharedServicesBaseStackConfig,
} from './config-adapters';
