/**
 * Core naming utilities for AWS resources
 */

import * as crypto from 'node:crypto';
import type { NamingConfig, ResourceType, IAMNamingOptions, S3NamingOptions } from './types';
import { validateEnvironment, getEnvironmentDisplayName } from '../constants/environments';

/**
 * Default company name used when not specified in config
 */
const DEFAULT_COMPANY = 'CodeIQLabs';

/**
 * Validates that required naming configuration is provided
 */
function validateNamingConfig(config: NamingConfig): void {
  if (!config.project) {
    throw new Error('Project name is required for resource naming');
  }
  if (!config.environment) {
    throw new Error('Environment name is required for resource naming');
  }
}

/**
 * Generates a stable hash from input string for deterministic naming
 * @param input - The input string to hash
 * @param len - Length of the hash to return (default: 8)
 * @returns Deterministic hash string
 */
function stableHash(input: string, len = 8): string {
  return crypto.createHash('sha256').update(input).digest('hex').slice(0, len);
}

/**
 * Sanitizes a string to be DNS-compliant for AWS resources
 * @param s - The string to sanitize
 * @param max - Maximum length (default: 63 for DNS labels)
 * @returns DNS-compliant string
 */
function sanitizeDnsLabel(s: string, max = 63): string {
  // Convert to lowercase and replace invalid characters with hyphens
  const cleaned = s
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/-+/g, '-');
  let trimmed = cleaned.slice(0, max);

  // DNS labels must start and end with alphanumeric characters
  trimmed = trimmed.replace(/^[^a-z0-9]+/, '').replace(/[^a-z0-9]+$/, '');

  // Ensure we don't return empty string or invalid names
  return trimmed || 'x';
}

/**
 * Resource-specific naming constraints for AWS services
 */
const RESOURCE_CONSTRAINTS: Record<ResourceType, { maxLength: number; allowedChars: RegExp }> = {
  Stack: { maxLength: 128, allowedChars: /^[a-zA-Z0-9-]+$/ },
  Bucket: { maxLength: 63, allowedChars: /^[a-z0-9.-]+$/ },
  Distribution: { maxLength: 128, allowedChars: /^[a-zA-Z0-9-]+$/ },
  Function: { maxLength: 64, allowedChars: /^[a-zA-Z0-9-_]+$/ },
  Role: { maxLength: 64, allowedChars: /^[a-zA-Z0-9+=,.@_-]+$/ },
  Export: { maxLength: 255, allowedChars: /^[a-zA-Z0-9-]+$/ },
  Domain: { maxLength: 253, allowedChars: /^[a-z0-9.-]+$/ },
  HostedZone: { maxLength: 253, allowedChars: /^[a-z0-9.-]+$/ },
  Certificate: { maxLength: 128, allowedChars: /^[a-zA-Z0-9-]+$/ },
  Table: { maxLength: 255, allowedChars: /^[a-zA-Z0-9_.-]+$/ },
  Queue: { maxLength: 80, allowedChars: /^[a-zA-Z0-9_-]+$/ },
  Topic: { maxLength: 256, allowedChars: /^[a-zA-Z0-9_-]+$/ },
  LogGroup: { maxLength: 512, allowedChars: /^[a-zA-Z0-9_/.-]+$/ },
  Layer: { maxLength: 140, allowedChars: /^[a-zA-Z0-9-_]+$/ },
};

/**
 * Sanitizes a resource name based on resource type constraints
 * @param name - The name to sanitize
 * @param resourceType - The AWS resource type
 * @returns Sanitized name that complies with AWS service limits
 */
function sanitizeResourceName(name: string, resourceType?: ResourceType): string {
  if (!resourceType) {
    // Default sanitization for unknown resource types
    return name
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-');
  }

  const constraints = RESOURCE_CONSTRAINTS[resourceType];
  if (!constraints) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-');
  }

  let sanitized = name;

  // Apply resource-specific character restrictions
  if (resourceType === 'Bucket' || resourceType === 'Domain' || resourceType === 'HostedZone') {
    sanitized = sanitized.toLowerCase().replace(/[^a-z0-9.-]/g, '-');
  } else if (resourceType === 'Function' || resourceType === 'Layer') {
    sanitized = sanitized.replace(/[^a-zA-Z0-9-_]/g, '-');
  } else if (resourceType === 'Role') {
    sanitized = sanitized.replace(/[^a-zA-Z0-9+=,.@_-]/g, '-');
  } else if (resourceType === 'Queue') {
    sanitized = sanitized.replace(/[^a-zA-Z0-9_-]/g, '-');
  } else if (resourceType === 'Topic') {
    sanitized = sanitized.replace(/[^a-zA-Z0-9_-]/g, '-');
  } else if (resourceType === 'Table') {
    sanitized = sanitized.replace(/[^a-zA-Z0-9_.-]/g, '-');
  } else if (resourceType === 'LogGroup') {
    sanitized = sanitized.replace(/[^a-zA-Z0-9_/.-]/g, '-');
  } else {
    // Default for Stack, Distribution, Export, Certificate
    sanitized = sanitized.replace(/[^a-zA-Z0-9-]/g, '-');
  }

  // Remove consecutive hyphens/underscores
  sanitized = sanitized.replace(/[-_]+/g, '-');

  // Trim to max length
  if (sanitized.length > constraints.maxLength) {
    sanitized = sanitized.slice(0, constraints.maxLength);
  }

  // Ensure it doesn't end with invalid characters
  sanitized = sanitized.replace(/[-_.]+$/, '');

  return sanitized || 'default';
}

/**
 * Generates a standardized CDK stack name with readable environment names
 *
 * Pattern (hardcoded): {Company}-{Project}-{DisplayEnvironment}-{Component}-Stack
 *
 * Uses display names like 'NonProd', 'Prod', 'Management', 'Shared', 'PreProd'
 * Component names must be PascalCase (enforced at the orchestrator level)
 *
 * @example
 * // With company specified
 * generateStackName({ company: 'CodeIQLabs', project: 'SaaS', environment: 'nprd' }, 'VPC')
 * // Returns: 'CodeIQLabs-SaaS-NonProd-VPC-Stack'
 *
 * // Without company (uses default 'CodeIQLabs')
 * generateStackName({ project: 'Management', environment: 'mgmt' }, 'Organizations')
 * // Returns: 'CodeIQLabs-Management-Management-Organizations-Stack'
 */
export function generateStackName(config: NamingConfig, component: string): string {
  validateNamingConfig(config);

  const company = config.company || DEFAULT_COMPANY;
  const displayEnv = getEnvironmentDisplayName(config.environment);

  // Hardcoded pattern: {Company}-{Project}-{DisplayEnvironment}-{Component}-Stack
  // Component names are already PascalCase (hardcoded in component-orchestrator.ts)
  return `${company}-${config.project}-${displayEnv}-${component}-Stack`;
}

/**
 * Generates a standardized CloudFormation export name
 * Pattern: {Project}-{Environment}-{ResourceName}
 */
export function generateExportName(config: NamingConfig, resourceName: string): string {
  validateNamingConfig(config);

  if (!resourceName) {
    throw new Error('Resource name is required for export naming');
  }

  return `${config.project}-${config.environment}-${resourceName}`;
}

/**
 * Generates a standardized resource name with resource-type aware constraints
 * Pattern: {project}-{environment}-{resourceName}
 *
 * Applies AWS service-specific naming rules and length limits based on resource type
 */
export function generateResourceName(
  config: NamingConfig,
  resourceName: string,
  resourceType?: ResourceType,
): string {
  validateNamingConfig(config);

  if (!resourceName) {
    throw new Error('Resource name is required');
  }

  // Build the base name
  const baseName = `${config.project}-${config.environment}-${resourceName}`;

  // Apply resource-type specific sanitization and constraints
  const sanitizedName = sanitizeResourceName(baseName, resourceType);

  // Validate the final name meets resource constraints
  if (resourceType && RESOURCE_CONSTRAINTS[resourceType]) {
    const constraints = RESOURCE_CONSTRAINTS[resourceType];
    if (sanitizedName.length > constraints.maxLength) {
      throw new Error(
        `Generated ${resourceType} name '${sanitizedName}' exceeds maximum length of ${constraints.maxLength} characters`,
      );
    }
    if (!constraints.allowedChars.test(sanitizedName)) {
      throw new Error(
        `Generated ${resourceType} name '${sanitizedName}' contains invalid characters for this resource type`,
      );
    }
  }

  return sanitizedName;
}

/**
 * Generates a standardized IAM role name with intelligent length handling
 * Pattern: {Project}-{Environment}-{RoleName}
 *
 * IAM role names must be 1-64 characters and can contain alphanumeric characters
 * plus these special characters: +=,.@_-
 *
 * When names exceed the length limit, the function can:
 * - Truncate and append a hash for uniqueness (default)
 * - Simply truncate
 * - Throw an error
 */
export function generateIAMRoleName(
  config: NamingConfig,
  roleName: string,
  options: IAMNamingOptions = {},
): string {
  validateNamingConfig(config);

  if (!roleName) {
    throw new Error('Role name is required for IAM role naming');
  }

  const maxLength = options.maxLength ?? 64;
  const lengthHandling = options.lengthHandling ?? 'hash';

  let name = `${config.project}-${config.environment}-${roleName}`;

  if (options.prefix) {
    name = `${options.prefix}-${name}`;
  }

  if (options.includeAccountId && config.accountId) {
    name += `-${config.accountId}`;
  }

  if (options.includeRegion && config.region) {
    name += `-${config.region}`;
  }

  // Apply basic character sanitization (without length constraints yet)
  let sanitizedName = name.replace(/[^a-zA-Z0-9+=,.@_-]/g, '-').replace(/[-_]+/g, '-');

  // Handle length constraints BEFORE final sanitization
  if (sanitizedName.length > maxLength) {
    switch (lengthHandling) {
      case 'error':
        throw new Error(
          `Generated IAM role name '${sanitizedName}' exceeds maximum length of ${maxLength} characters`,
        );

      case 'truncate':
        sanitizedName = sanitizedName.slice(0, maxLength);
        break;

      case 'hash':
      default: {
        // Truncate and append hash for uniqueness
        const hashLength = 8;
        const maxBaseLength = maxLength - hashLength - 1; // -1 for hyphen
        if (maxBaseLength < 1) {
          throw new Error(`maxLength ${maxLength} is too small to accommodate hash suffix`);
        }
        const baseName = sanitizedName.slice(0, maxBaseLength);
        const hash = stableHash(sanitizedName, hashLength);
        sanitizedName = `${baseName}-${hash}`;
        break;
      }
    }
  }

  // Final sanitization to ensure valid characters and no trailing invalid chars
  sanitizedName = sanitizedName.replace(/[-_.]+$/, '');

  // Final validation
  if (sanitizedName.length < 1) {
    throw new Error(`Generated IAM role name cannot be empty`);
  }
  if (sanitizedName.length > maxLength) {
    throw new Error(
      `Internal error: Generated IAM role name still exceeds length after processing`,
    );
  }

  return sanitizedName;
}

/**
 * Generates a standardized S3 bucket name with DNS compliance and deterministic suffixes
 * Pattern: {project}-{environment}-{purpose}[-{stable-suffix}]
 *
 * S3 bucket names must:
 * - Be 3-63 characters long
 * - Contain only lowercase letters, numbers, hyphens, and periods
 * - Start and end with a letter or number
 * - Not be formatted as an IP address
 */
export function generateS3BucketName(config: NamingConfig, options: S3NamingOptions): string {
  validateNamingConfig(config);

  if (!options.purpose) {
    throw new Error('Purpose is required for S3 bucket naming');
  }

  const base = `${config.project}-${config.environment}-${options.purpose}`;
  let name = sanitizeDnsLabel(base, 57); // Leave room for hyphen + suffix

  // Determine if we should include a suffix (default: true for global uniqueness)
  const shouldIncludeSuffix = options.includeStableSuffix !== false;

  if (shouldIncludeSuffix) {
    // Deterministic suffix based on account/region/purpose for IaC consistency
    const hashInput = `${config.accountId ?? ''}:${config.region ?? ''}:${options.purpose}`;
    const suffix = stableHash(hashInput, 6);
    name = sanitizeDnsLabel(`${name}-${suffix}`, 63);
  }

  // Final validation for S3 bucket name requirements
  if (name.length < 3) {
    throw new Error(`Generated S3 bucket name '${name}' is too short (minimum 3 characters)`);
  }
  if (name.length > 63) {
    throw new Error(`Generated S3 bucket name '${name}' is too long (maximum 63 characters)`);
  }
  if (/^\d+\.\d+\.\d+\.\d+$/.test(name)) {
    throw new Error(`Generated S3 bucket name '${name}' cannot be formatted as an IP address`);
  }

  return name;
}

/**
 * Generates a standardized domain name for hosted zones
 */
export function generateDomainName(
  config: NamingConfig,
  baseDomain: string,
  subdomain?: string,
): string {
  validateNamingConfig(config);

  if (!baseDomain) {
    throw new Error('Base domain is required for domain naming');
  }

  if (subdomain) {
    return `${subdomain}.${baseDomain}`;
  }

  return baseDomain;
}

/**
 * Generate a standardized CDK stage name using validated environment values
 *
 * This function enforces the use of valid environment constants and creates
 * consistent stage names across all CodeIQLabs projects.
 *
 * @param project - Project name (e.g., "BudgetTrack", "CodeIQLabs")
 * @param environment - Environment string that must be one of ENV_VALUES
 * @returns Standardized stage name in format: {project}-{environment}
 * @throws Error if environment is not valid
 *
 * @example
 * ```typescript
 * // Valid usage
 * generateStageName("BudgetTrack", "mgmt") // Returns: "BudgetTrack-mgmt"
 * generateStageName("CodeIQLabs", "prod") // Returns: "CodeIQLabs-prod"
 *
 * // Invalid usage - throws error
 * generateStageName("BudgetTrack", "Management") // Error: Invalid environment
 * ```
 */
export function generateStageName(project: string, environment: string): string {
  if (!project || project.trim() === '') {
    throw new Error('Project name cannot be empty');
  }

  // Validate environment against ENV_VALUES constants
  const validatedEnv = validateEnvironment(environment);

  return `${project.trim()}-${validatedEnv}`;
}
