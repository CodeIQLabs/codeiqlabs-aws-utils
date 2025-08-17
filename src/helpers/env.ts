/**
 * Environment variable helper functions
 *
 * These utilities provide consistent environment variable handling
 * with validation and error reporting across CodeIQLabs projects.
 */

// Type declarations for Node.js globals
declare const process: {
  env: Record<string, string | undefined>;
};

declare const console: {
  log: (message: string) => void;
};

export interface EnvVarOptions {
  description?: string;
  verbose?: boolean;
  errorPrefix?: string;
}

/**
 * Get a required environment variable with validation and error handling
 *
 * @param key - Environment variable name
 * @param options - Configuration options
 * @returns The environment variable value
 * @throws Error if the environment variable is not set or empty
 */
export function getRequiredEnvVar(key: string, options: EnvVarOptions = {}): string {
  const value = process.env[key];

  if (!value || value.trim() === '') {
    const prefix = options.errorPrefix ?? 'Configuration Error';
    const description = options.description ? ` (${options.description})` : '';
    throw new Error(
      `${prefix}: Required environment variable '${key}' is not set${description}. ` +
        `Please set ${key} in your environment.`,
    );
  }

  if (options.verbose) {
    console.log(`Using environment variable ${key}: ${value}`);
  }

  return value.trim();
}

/**
 * Backward-compatible convenience function for getting required environment variables
 *
 * @param name - Environment variable name
 * @param description - Optional description for error messages
 * @returns The environment variable value
 * @throws Error if the environment variable is not set or empty
 */
export function getRequiredEnvVarStrict(name: string, description?: string): string {
  return getRequiredEnvVar(name, { description });
}

/**
 * Get and validate an AWS account ID from environment variable
 *
 * @param envVarName - Environment variable name containing the account ID
 * @param accountName - Descriptive name for the account (for error messages)
 * @param options - Configuration options
 * @returns The validated 12-digit AWS account ID
 * @throws Error if the account ID is invalid or not set
 */
export function getAccountIdFromEnv(
  envVarName: string,
  accountName: string,
  options: EnvVarOptions = {},
): string {
  const accountId = getRequiredEnvVar(envVarName, {
    ...options,
    description: `AWS Account ID for ${accountName}`,
  });

  // Validate AWS account ID format (12 digits)
  const accountIdPattern = /^[0-9]{12}$/;
  if (!accountIdPattern.test(accountId)) {
    const prefix = options.errorPrefix ?? 'Configuration Error';
    throw new Error(
      `${prefix}: Invalid AWS Account ID format for ${accountName}: ${accountId}. ` +
        `Expected: 12-digit number (e.g., 123456789012)`,
    );
  }

  if (options.verbose) {
    console.log(`Validated AWS Account ID for ${accountName}: ${accountId}`);
  }

  return accountId;
}

/**
 * Get an environment variable with a default value
 *
 * @param key - Environment variable name
 * @param defaultValue - Default value if environment variable is not set
 * @param options - Configuration options
 * @returns The environment variable value or default value
 */
export function getEnvVarWithDefault(
  key: string,
  defaultValue: string,
  options: EnvVarOptions = {},
): string {
  const value = process.env[key];

  if (!value || value.trim() === '') {
    if (options.verbose) {
      console.log(`Using default value for ${key}: ${defaultValue}`);
    }
    return defaultValue;
  }

  if (options.verbose) {
    console.log(`Using environment variable ${key}: ${value.trim()}`);
  }

  return value.trim();
}
