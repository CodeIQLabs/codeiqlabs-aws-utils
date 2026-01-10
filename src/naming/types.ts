// Import environment types from centralized location
import type { ExtendedEnvironment } from '../constants/environments';

// Re-export environment types from centralized location
export type { Environment, ExtendedEnvironment } from '../constants/environments';

// Re-export tagging types for convenience
export type { TaggingOptions, ExtraTags } from '../tagging/types';

export type ProjectName = string;
export type CompanyName = string;

/**
 * Core naming configuration interface
 * Used across all CodeIQLabs projects for consistent resource naming
 *
 * Stack naming pattern (hardcoded in library):
 * {company}-{project}-{environment}-{component}-Stack
 *
 * Example: CodeIQLabs-SaaS-NonProd-VPC-Stack
 */
export interface NamingConfig {
  /** Company prefix for stack names (e.g., "CodeIQLabs") */
  company?: CompanyName;
  /** Project identifier (e.g., "SaaS", "Management") */
  project: ProjectName;
  /** Environment code (e.g., "nprd", "prod", "mgmt") */
  environment: ExtendedEnvironment;
  /** Optional brand/tenant identifier for brand-scoped resources */
  brand?: string;
  region?: string;
  accountId?: string;
}

/**
 * Interface for objects that can provide naming configuration
 * Used to support both direct config objects and naming utility instances
 */
export interface NamingProvider {
  getConfig(): NamingConfig;
}

/**
 * Union type for naming input - can be either a config object or a provider
 * This allows functions to accept both ResourceNaming instances and plain config objects
 */
export type NamingInput = NamingProvider | NamingConfig;

export interface ExportNameOptions {
  suffix?: string;
  includeResourceType?: boolean;
}

export interface IAMNamingOptions {
  includeAccountId?: boolean;
  includeRegion?: boolean;
  prefix?: string;
  /** Maximum length for the IAM role name (default: 64, AWS limit) */
  maxLength?: number;
  /**
   * How to handle names that exceed maxLength:
   * - 'truncate': Simply truncate to maxLength
   * - 'hash': Truncate and append short hash for uniqueness (default)
   * - 'error': Throw an error
   */
  lengthHandling?: 'truncate' | 'hash' | 'error';
}

export interface S3NamingOptions {
  purpose: string;
  /** Include a deterministic suffix for global uniqueness (default: true) */
  includeStableSuffix?: boolean;
}

export type ResourceType =
  | 'Stack'
  | 'Bucket'
  | 'Distribution'
  | 'Function'
  | 'Role'
  | 'Export'
  | 'Domain'
  | 'HostedZone'
  | 'Certificate'
  | 'Table'
  | 'Queue'
  | 'Topic'
  | 'LogGroup'
  | 'Layer';

export interface ResourceNameOptions {
  brand?: string;
  resourceType?: ResourceType;
}

/**
 * Options for stack name generation
 */
export interface StackNameOptions {
  /**
   * Skip the environment segment in the stack name.
   * Use for single-account repos like management-aws.
   *
   * Pattern with skipEnvironment=false (default):
   *   {Company}-{Project}-{Environment}-{Component}-Stack
   *   Example: CodeIQLabs-SaaS-NonProd-VPC-Stack
   *
   * Pattern with skipEnvironment=true:
   *   {Company}-{Project}-{Component}-Stack
   *   Example: CodeIQLabs-Management-Organizations-Stack
   */
  skipEnvironment?: boolean;
}

// ============================================================================
// SSM Parameter Types
// ============================================================================

/**
 * Shared options for creating SSM parameters
 */
export interface BaseParamOpts {
  /** Logical group under /{project}/{environment}/{category}/{name} */
  category: string;
  /** Leaf name (path-safe; we won't escape it) */
  name: string;
  /** Human description */
  description?: string;
  /** Construct id prefix (defaults to "SSMParam") */
  idPrefix?: string;
  /** SSM tier (default STANDARD) - requires aws-cdk-lib/aws-ssm to be available */
  tier?: any; // Using 'any' to avoid requiring aws-cdk-lib in this types file
}

/**
 * Options for creating string parameters
 */
export interface StringParamOpts extends BaseParamOpts {
  /** Parameter value */
  value: string;
}

/**
 * Options for creating multiple parameters
 */
export interface BatchParamOpts extends Omit<BaseParamOpts, 'name'> {
  /** Record of parameter names to values */
  parameters: Record<string, string>;
  /** Prefix for parameter descriptions */
  descriptionPrefix: string;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Resolve naming input to a concrete config
 * Supports both direct config objects and naming provider instances
 */
export function resolveNaming(input: NamingInput): NamingConfig {
  // early return if it already looks like a config
  if ((input as NamingConfig).project && (input as NamingConfig).environment) {
    return input as NamingConfig;
  }
  const provider = input as NamingProvider;
  const cfg = provider.getConfig?.();
  if (!cfg?.project || !cfg?.environment) {
    throw new Error(
      'Invalid naming input: expected {project, environment} or a provider with getConfig()',
    );
  }
  return cfg;
}

/**
 * Sanitize string for use in CDK construct IDs
 * Removes all non-alphanumeric characters
 */
export function sanitizeForConstructId(s: string): string {
  return (s ?? '').replace(/[^A-Za-z0-9]/g, '');
}
