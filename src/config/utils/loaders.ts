import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import type { z } from 'zod';
import {
  ManagementAppConfigSchema,
  type ManagementAppConfig,
} from '../schemas/applications/management';
import { WorkloadAppConfigSchema, type WorkloadAppConfig } from '../schemas/applications/workload';

/**
 * Generic configuration loader with YAML parsing and environment variable expansion
 *
 * This utility provides a standardized way to load and validate configuration files
 * across CodeIQLabs projects. It supports:
 * - YAML file parsing
 * - Environment variable expansion (${VAR_NAME} syntax)
 * - Zod schema validation
 * - Detailed error reporting
 */

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
 * Expand environment variables in a string
 *
 * Replaces ${VAR_NAME} patterns with the corresponding environment variable values.
 * Throws an error if a referenced environment variable is not set.
 *
 * @param content - String content with potential environment variable references
 * @returns String with environment variables expanded
 * @throws Error if any referenced environment variable is not set
 */
export function expandEnvironmentVariables(content: string): string {
  return content.replace(/\$\{([A-Z0-9_]+)\}/g, (_: string, varName: string) => {
    const value = process.env[varName];
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
