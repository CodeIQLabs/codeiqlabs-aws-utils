import { readFileSync } from 'fs';
import { join, extname } from 'path';
import { glob } from 'glob';
import { load } from 'js-yaml';
import type { z } from 'zod';
import {
  ManagementAppConfigSchema,
  type ManagementAppConfig,
} from '../schemas/applications/management';
import { WorkloadAppConfigSchema, type WorkloadAppConfig } from '../schemas/applications/workload';
import {
  validateManifest,
  type AnyManifestConfig,
} from '../schemas/validation/manifest-validators';

/**
 * Generic configuration loader with auto-detection and comprehensive format support
 *
 * This utility provides a standardized way to load and validate configuration files
 * across CodeIQLabs projects. It supports:
 * - YAML and JSON file parsing
 * - Environment variable expansion (${VAR_NAME} syntax)
 * - Automatic manifest type detection via discriminated unions
 * - Zod schema validation
 * - Detailed error reporting
 * - Batch loading from directories or glob patterns
 */

/**
 * Supported file formats for manifest files
 */
export type ManifestFormat = 'yaml' | 'yml' | 'json';

/**
 * Result of loading and validating a manifest file with auto-detection
 */
export interface ManifestLoadResult {
  success: true;
  data: AnyManifestConfig;
  type: 'management' | 'workload' | 'shared-services' | 'baseline';
  filePath: string;
  format: ManifestFormat;
}

/**
 * Error result when loading or validating a manifest file fails
 */
export interface ManifestLoadError {
  success: false;
  error: string;
  details?: z.ZodError | Error;
  filePath: string;
  format?: ManifestFormat;
}

/**
 * Combined result type for manifest loading operations
 */
export type ManifestResult = ManifestLoadResult | ManifestLoadError;

/**
 * Options for loading manifest files
 */
export interface LoadManifestOptions {
  /**
   * Whether to expand environment variables in the manifest content
   * @default true
   */
  expandEnvVars?: boolean;

  /**
   * Custom environment variables to use for expansion
   * If not provided, uses process.env
   */
  envVars?: Record<string, string>;

  /**
   * Whether to validate the manifest against the schema
   * @default true
   */
  validate?: boolean;
}

/**
 * Load and validate a configuration file
 *
 * @param path - Path to the YAML configuration file
 * @param schema - Zod schema for validation
 * @returns Parsed and validated configuration object
 * @throws Error if file cannot be read, parsed, or validated
 */
export function loadConfig<T>(path: string, schema: z.ZodType<T>): T {
  try {
    const raw = readFileSync(path, 'utf8');

    // Expand environment variables in the format ${VAR_NAME}
    const expanded = expandEnvironmentVariables(raw);

    // Parse YAML
    const parsed = load(expanded);

    // Validate with Zod schema
    const result = schema.safeParse(parsed);
    if (!result.success) {
      const errorMessages = result.error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join('\n');
      throw new Error(`Configuration validation failed:\n${errorMessages}`);
    }

    return result.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load config from ${path}: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Parse file content based on file extension
 */
function parseFileContent(content: string, format: ManifestFormat): unknown {
  switch (format) {
    case 'json':
      return JSON.parse(content);
    case 'yaml':
    case 'yml':
      return load(content);
    default:
      throw new Error(`Unsupported file format: ${format}`);
  }
}

/**
 * Determine file format from file extension
 */
function getFileFormat(filePath: string): ManifestFormat {
  const ext = extname(filePath).toLowerCase().slice(1);
  if (ext === 'yaml' || ext === 'yml') return ext as ManifestFormat;
  if (ext === 'json') return 'json';
  throw new Error(`Unsupported file extension: ${ext}`);
}

/**
 * Expand environment variables in a string
 *
 * Replaces ${VAR_NAME} patterns with the corresponding environment variable values.
 * Supports both the original strict pattern and a more flexible pattern.
 * Throws an error if a referenced environment variable is not set.
 *
 * @param content - String content with potential environment variable references
 * @param envVars - Environment variables to use (defaults to process.env)
 * @returns String with environment variables expanded
 * @throws Error if any referenced environment variable is not set
 */
export function expandEnvironmentVariables(
  content: string,
  envVars: Record<string, string> = process.env as Record<string, string>,
): string {
  return content.replace(/\$\{([^}]+)\}/g, (_, varName) => {
    const value = envVars[varName];
    if (value === undefined) {
      throw new Error(`Environment variable ${varName} is required but not set`);
    }
    return value;
  });
}

/**
 * Validate a configuration object against a schema without loading from file
 *
 * @param config - Configuration object to validate
 * @param schema - Zod schema for validation
 * @returns Validated configuration object
 * @throws Error if validation fails
 */
export function validateConfig<T>(config: unknown, schema: z.ZodType<T>): T {
  const result = schema.safeParse(config);
  if (!result.success) {
    const errorMessages = result.error.errors
      .map((err) => `${err.path.join('.')}: ${err.message}`)
      .join('\n');
    throw new Error(`Configuration validation failed:\n${errorMessages}`);
  }
  return result.data;
}

/**
 * Load and validate a management AWS manifest file
 *
 * Convenience function for loading management account configurations.
 * Uses the standardized ManagementAppConfigSchema for validation.
 *
 * @param path - Path to the YAML configuration file
 * @returns Parsed and validated management configuration object
 * @throws Error if file cannot be read, parsed, or validated
 */
export function loadManagementManifest(path: string): ManagementAppConfig {
  try {
    const raw = readFileSync(path, 'utf8');
    const expanded = expandEnvironmentVariables(raw);
    const parsed = load(expanded);

    // Validate with the management schema
    const result = ManagementAppConfigSchema.safeParse(parsed);
    if (!result.success) {
      const errorMessages = result.error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join('\n');
      throw new Error(`Configuration validation failed:\n${errorMessages}`);
    }

    return result.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load config from ${path}: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Load and validate workload configuration from YAML manifest file
 *
 * This function loads a YAML configuration file for CodeIQLabs workload
 * projects (like deployment permissions), expands environment variables,
 * and validates the configuration against the workload schema.
 *
 * @param path - Path to the YAML configuration file
 * @returns Parsed and validated workload configuration
 * @throws Error if file cannot be read, parsed, or validated
 *
 * @example
 * ```typescript
 * import { loadWorkloadManifest } from '@codeiqlabs/aws-utils/config';
 *
 * const config = loadWorkloadManifest('src/manifest.yaml');
 * console.log(config.deploymentPermissions.projects);
 * ```
 */
export function loadWorkloadManifest(path: string): WorkloadAppConfig {
  try {
    const raw = readFileSync(path, 'utf8');

    // Expand environment variables in the format ${VAR_NAME}
    const expanded = expandEnvironmentVariables(raw);

    // Parse YAML
    const parsed = load(expanded);

    // Validate with Zod schema
    const result = WorkloadAppConfigSchema.safeParse(parsed);
    if (!result.success) {
      const errorMessages = result.error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join('\n');
      throw new Error(`Configuration validation failed:\n${errorMessages}`);
    }

    return result.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load workload config from ${path}: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Load and validate any manifest file with automatic type detection
 *
 * This is the main generic loader that automatically detects the manifest type
 * based on the 'type' field and validates against the appropriate schema.
 *
 * @param filePath - Path to the manifest file
 * @param options - Loading options
 * @returns Promise resolving to manifest result with auto-detected type
 *
 * @example
 * ```typescript
 * import { loadManifest } from '@codeiqlabs/aws-utils/config';
 *
 * const result = await loadManifest('./manifest.yaml');
 * if (result.success) {
 *   console.log(`Loaded ${result.type} manifest from ${result.filePath}`);
 *   // result.data is properly typed based on detected type
 * }
 * ```
 */
export async function loadManifest(
  filePath: string,
  options: LoadManifestOptions = {},
): Promise<ManifestResult> {
  const {
    expandEnvVars = true,
    envVars = process.env as Record<string, string>,
    validate = true,
  } = options;

  try {
    // Determine file format
    const format = getFileFormat(filePath);

    // Read file content
    let content = readFileSync(filePath, 'utf-8');

    // Expand environment variables if requested
    if (expandEnvVars) {
      content = expandEnvironmentVariables(content, envVars);
    }

    // Parse content based on format
    const data = parseFileContent(content, format);

    // Validate if requested
    if (validate) {
      const validationResult = validateManifest(data);

      if (!validationResult.success) {
        return {
          success: false,
          error: 'Manifest validation failed',
          details: validationResult.error,
          filePath,
          format,
        };
      }

      return {
        success: true,
        data: validationResult.data,
        type: validationResult.type,
        filePath,
        format,
      };
    }

    // Return unvalidated data (not recommended for production)
    return {
      success: true,
      data: data as AnyManifestConfig,
      type: (data as any).type,
      filePath,
      format,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      details: error instanceof Error ? error : undefined,
      filePath,
      format: undefined,
    };
  }
}

/**
 * Load multiple manifest files from a directory or glob pattern
 *
 * @param pattern - Glob pattern or directory path to search for manifest files
 * @param options - Loading options
 * @returns Promise resolving to array of manifest results
 *
 * @example
 * ```typescript
 * import { loadManifests } from '@codeiqlabs/aws-utils/config';
 *
 * // Load all manifests from a directory
 * const results = await loadManifests('./config/');
 *
 * // Load manifests matching a pattern
 * const results = await loadManifests('./config/manifest-files/');
 * ```
 */
export async function loadManifests(
  pattern: string,
  options: LoadManifestOptions = {},
): Promise<ManifestResult[]> {
  try {
    // If pattern is a directory, create a glob pattern for manifest files
    const globPattern =
      pattern.endsWith('/') || !pattern.includes('*')
        ? join(pattern, '**/*{-manifest,}.{yaml,yml,json}')
        : pattern;

    // Find all matching files
    const files = await glob(globPattern, {
      ignore: ['**/node_modules/**', '**/cdk.out/**', '**/.git/**'],
    });

    // Load all files in parallel
    const results = await Promise.all(files.map((file) => loadManifest(file, options)));

    return results;
  } catch (error) {
    return [
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load manifests',
        details: error instanceof Error ? error : undefined,
        filePath: pattern,
      },
    ];
  }
}

/**
 * Load manifests and organize them by type
 *
 * @param pattern - Glob pattern or directory path
 * @param options - Loading options
 * @returns Promise resolving to manifests organized by type
 *
 * @example
 * ```typescript
 * import { loadManifestsByType } from '@codeiqlabs/aws-utils/config';
 *
 * const organized = await loadManifestsByType('./config/');
 * console.log(`Found ${organized.management.length} management manifests`);
 * console.log(`Found ${organized.workload.length} workload manifests`);
 * ```
 */
export async function loadManifestsByType(
  pattern: string,
  options: LoadManifestOptions = {},
): Promise<{
  management: ManifestLoadResult[];
  baseline: ManifestLoadResult[];
  'shared-services': ManifestLoadResult[];
  workload: ManifestLoadResult[];
  errors: ManifestLoadError[];
}> {
  const results = await loadManifests(pattern, options);

  const organized = {
    management: [] as ManifestLoadResult[],
    baseline: [] as ManifestLoadResult[],
    'shared-services': [] as ManifestLoadResult[],
    workload: [] as ManifestLoadResult[],
    errors: [] as ManifestLoadError[],
  };

  for (const result of results) {
    if (result.success) {
      organized[result.type].push(result);
    } else {
      organized.errors.push(result);
    }
  }

  return organized;
}

/**
 * Utility function to check if a file is a manifest file based on naming convention
 *
 * @param filePath - Path to check
 * @returns True if the file appears to be a manifest file
 */
export function isManifestFile(filePath: string): boolean {
  const fileName = filePath.toLowerCase();
  const hasManifestExtension = /\.(yaml|yml|json)$/.test(fileName);
  const hasManifestName =
    fileName.includes('manifest') ||
    fileName.endsWith('manifest.yaml') ||
    fileName.endsWith('manifest.yml') ||
    fileName.endsWith('manifest.json');

  return hasManifestExtension && hasManifestName;
}
