/**
 * Enhanced Manifest Loading for CDK Applications
 *
 * This module provides enhanced manifest loading utilities specifically designed
 * for CDK application bootstrap scenarios. It builds on the core manifest loading
 * functionality with additional validation and error handling.
 */

import { loadManifest as coreLoadManifest } from '../config';
import type { LoadManifestOptions, UnifiedAppConfig } from '../config';

/**
 * Unified manifest configuration (replaces legacy manifest types)
 */
export type ApplicationManifestConfig = UnifiedAppConfig;

/**
 * Enhanced manifest loading result for applications
 */
export interface ApplicationManifestResult {
  /** Whether the loading was successful */
  success: boolean;
  /** The loaded manifest data (if successful) */
  data?: ApplicationManifestConfig;
  /** The detected manifest type (if successful) */
  type?: 'management' | 'workload' | 'shared-services' | 'baseline' | 'unified';
  /** Error message (if failed) */
  error?: string;
  /** Detailed error information (if failed) */
  details?: any;
  /** The file path that was loaded */
  filePath: string;
}

/**
 * Options for application manifest initialization
 */
export interface InitializeAppOptions extends LoadManifestOptions {
  /**
   * Whether to provide verbose error messages
   * Defaults to true for better developer experience
   */
  verbose?: boolean;
}

/**
 * Initialize application with enhanced manifest loading and validation
 *
 * This function provides a standardized way to load and validate manifest files
 * for CDK applications with enhanced error messages and type validation.
 *
 * @param manifestPath - Path to the manifest file (defaults to 'src/manifest.yaml')
 * @param options - Loading and validation options
 * @returns Application manifest result
 *
 * @example
 * ```typescript
 * // Basic usage
 * const result = initializeApp();
 * if (result.success) {
 *   console.log(`Loaded ${result.type} manifest`);
 * }
 *
 * ```
 */
export async function initializeApp(
  manifestPath: string = 'src/manifest.yaml',
  options: InitializeAppOptions = {},
): Promise<ApplicationManifestResult> {
  const { verbose = true, ...loadOptions } = options;

  try {
    // Load manifest using core loader
    const result = await coreLoadManifest(manifestPath, {
      validate: true,
      expandEnvVars: true,
      ...loadOptions,
    });

    if (!result.success) {
      return {
        success: false,
        error: verbose
          ? `Failed to load manifest from '${manifestPath}': ${result.error}`
          : result.error,
        details: result.details,
        filePath: manifestPath,
      };
    }

    // Validate manifest data structure (skip for unified - already validated by schema)
    if (result.type !== 'unified') {
      const validationResult = validateManifestStructure(result.data, result.type);
      if (!validationResult.valid) {
        return {
          success: false,
          error: verbose
            ? `Manifest validation failed: ${validationResult.error}`
            : validationResult.error,
          details: validationResult.details,
          filePath: manifestPath,
        };
      }
    }

    return {
      success: true,
      data: result.data as ApplicationManifestConfig,
      type: result.type,
      filePath: manifestPath,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: verbose ? `Application initialization failed: ${errorMessage}` : errorMessage,
      details: error,
      filePath: manifestPath,
    };
  }
}

/**
 * Validate manifest structure for application use
 *
 * @param data - The manifest data to validate
 * @param type - The detected manifest type
 * @returns Validation result
 */
function validateManifestStructure(
  data: any,
  type: 'management' | 'workload' | 'shared-services' | 'baseline' | 'unified',
): { valid: boolean; error?: string; details?: any } {
  try {
    // Basic structure validation
    if (!data || typeof data !== 'object') {
      return {
        valid: false,
        error: 'Manifest data is not a valid object',
      };
    }

    // Validate required fields
    if (!data.project || typeof data.project !== 'string') {
      return {
        valid: false,
        error: 'Missing or invalid project name in manifest',
      };
    }

    if (!data.company || typeof data.company !== 'string') {
      return {
        valid: false,
        error: 'Missing or invalid company name in manifest',
      };
    }

    if (!data.management || typeof data.management !== 'object') {
      return {
        valid: false,
        error: 'Missing or invalid management account configuration in manifest',
      };
    }

    // Type-specific validation
    switch (type) {
      case 'management':
        return validateManagementManifest(data);
      case 'workload':
        return validateWorkloadManifest(data);
      case 'shared-services':
        return validateSharedServicesManifest(data);
      case 'baseline':
        return validateBaselineManifest(data);
      default:
        return {
          valid: false,
          error: `Unsupported manifest type: ${type}`,
        };
    }
  } catch (error) {
    return {
      valid: false,
      error: `Manifest validation error: ${error instanceof Error ? error.message : String(error)}`,
      details: error,
    };
  }
}

/**
 * Validate management manifest structure
 */
function validateManagementManifest(data: any): { valid: boolean; error?: string } {
  if (!data.organization) {
    return {
      valid: false,
      error: 'Management manifest missing organization configuration',
    };
  }

  if (!data.identityCenter) {
    return {
      valid: false,
      error: 'Management manifest missing identityCenter configuration',
    };
  }

  return { valid: true };
}

/**
 * Validate workload manifest structure
 */
function validateWorkloadManifest(data: any): { valid: boolean; error?: string } {
  if (!data.environments || typeof data.environments !== 'object') {
    return {
      valid: false,
      error: 'Workload manifest missing environments configuration',
    };
  }

  const envNames = Object.keys(data.environments);
  if (envNames.length === 0) {
    return {
      valid: false,
      error: 'Workload manifest must define at least one environment',
    };
  }

  return { valid: true };
}

/**
 * Validate shared services manifest structure
 */
function validateSharedServicesManifest(data: any): { valid: boolean; error?: string } {
  if (!data.sharedServices) {
    return {
      valid: false,
      error: 'Shared services manifest missing sharedServices configuration',
    };
  }

  return { valid: true };
}

/**
 * Validate baseline manifest structure
 */
function validateBaselineManifest(data: any): { valid: boolean; error?: string } {
  if (!data.environments || typeof data.environments !== 'object') {
    return {
      valid: false,
      error: 'Baseline manifest missing environments configuration',
    };
  }

  return { valid: true };
}
