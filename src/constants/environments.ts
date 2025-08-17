/**
 * Centralized environment constants for CodeIQLabs AWS utilities
 *
 * This module provides the single source of truth for all environment-related
 * constants and types used across the aws-utils package.
 */

// ============================================================================
// Environment Constants - Single Source of Truth
// ============================================================================

/**
 * All valid environment values used across CodeIQLabs projects
 * This is the single source of truth for environment validation
 */
export const ENV_VALUES = ['nprd', 'pprd', 'prod', 'mgmt', 'shrd'] as const;

/**
 * Environment type derived from the constants array
 * This ensures type safety and consistency with the validation array
 */
export type Environment = (typeof ENV_VALUES)[number];

/**
 * Extended environment type that includes standard environments plus custom ones
 * Use this when you need to support additional environments beyond np/prod
 */
export type ExtendedEnvironment = Environment | string;

// ============================================================================
// Environment Display Names
// ============================================================================

/**
 * Mapping from environment codes to readable display names for stack naming
 * Used when you need human-readable names in stack names or descriptions
 */
export const ENV_DISPLAY_NAMES: Record<Environment, string> = {
  nprd: 'NonProd',
  pprd: 'PreProd',
  prod: 'Prod',
  mgmt: 'Management',
  shrd: 'Shared',
} as const;

// ============================================================================
// Environment Validation
// ============================================================================

/**
 * Validate environment value against allowed values
 * @param env - Environment string to validate
 * @returns Validated environment
 * @throws Error if environment is not valid
 */
export function validateEnvironment(env: string): Environment {
  const key = (env ?? '').toLowerCase().trim();
  if (ENV_VALUES.includes(key as Environment)) {
    return key as Environment;
  }
  throw new Error(`Invalid environment '${env}'. Allowed values: ${ENV_VALUES.join(', ')}`);
}

/**
 * Check if an environment value is valid without throwing
 * @param env - Environment string to check
 * @returns True if environment is valid, false otherwise
 */
export function isValidEnvironment(env: string): env is Environment {
  const key = (env ?? '').toLowerCase().trim();
  return ENV_VALUES.includes(key as Environment);
}

/**
 * Get the display name for an environment
 * @param env - Environment string to get display name for
 * @returns Display name for the environment
 * @throws Error if environment is not valid
 *
 * @example
 * ```typescript
 * getEnvironmentDisplayName('nprd') // Returns: 'NonProd'
 * getEnvironmentDisplayName('prod') // Returns: 'Prod'
 * getEnvironmentDisplayName('mgmt') // Returns: 'Management'
 * ```
 */
export function getEnvironmentDisplayName(env: string): string {
  const validatedEnv = validateEnvironment(env);
  return ENV_DISPLAY_NAMES[validatedEnv];
}
