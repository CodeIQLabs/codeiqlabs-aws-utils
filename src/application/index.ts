/**
 * Application Utilities for CDK Bootstrap
 *
 * This module provides enhanced utilities specifically designed for CDK application
 * bootstrap scenarios, including manifest loading and validation utilities.
 *
 * Key exports:
 * - initializeApp: Enhanced manifest loading with validation
 * - Types: Application-specific type definitions
 *
 * @example
 * ```typescript
 * import { initializeApp } from '@codeiqlabs/aws-utils/application';
 *
 * // Load and validate manifest
 * const result = await initializeApp('src/manifest.yaml');
 *
 * if (result.success) {
 *   // Use the unified config
 *   console.log(result.data.project, result.data.deployment);
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
