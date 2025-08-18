/**
 * Core tagging functions for AWS resources
 *
 * This module provides framework-agnostic tag generation functions that can be used
 * with any AWS deployment tool (CDK, CloudFormation, Terraform, etc.).
 */

import type { NamingConfig } from '../naming/types';
import type { TaggingOptions, StandardTags } from './types';
import { validateEnvironment } from '../constants/environments';

// Re-export types for convenience
export type { StandardTags } from './types';
// Backward compatibility export
export type { CodeIQLabsStandardTags } from './types';

// ============================================================================
// FRAMEWORK-AGNOSTIC TAG GENERATION
// ============================================================================

/**
 * Generate standardized tags for AWS resources following enterprise standards
 * This is framework-agnostic and can be used with any AWS deployment tool
 *
 * @param config - Naming configuration containing project and environment
 * @param options - Tagging configuration including owner and company
 * @returns Standard tags object
 */
export function generateStandardTags(
  config: NamingConfig,
  options: TaggingOptions = {},
): StandardTags {
  if (!config.project) {
    throw new Error('Project name is required for tag generation');
  }
  if (!config.environment) {
    throw new Error('Environment name is required for tag generation');
  }
  if (!options.owner) {
    throw new Error('Owner is required for tag generation. Please specify options.owner');
  }
  if (!options.company) {
    throw new Error('Company is required for tag generation. Please specify options.company');
  }

  const env = validateEnvironment(config.environment);

  const standardTags: StandardTags = {
    App: config.project, // e.g., MyProject, BudgetTrack
    Environment: env, // validated environment
    Component: options.component || 'Unknown', // Required component
    Owner: options.owner, // Configurable owner
    ManagedBy: options.managedBy ?? 'CDK', // Deployment tool
    Company: options.company, // Configurable company
  };

  // Optional tags
  if (options.ownerEmail) {
    standardTags.OwnerEmail = options.ownerEmail;
  }

  if (options.costCenter) {
    standardTags.CostCenter = options.costCenter;
  }

  if (options.dataClassification) {
    standardTags.DataClassification = options.dataClassification;
  }

  if (options.repo) {
    standardTags.Repo = options.repo;
  }

  // Merge any additional custom tags (but standard tags take precedence)
  if (options.customTags) {
    Object.assign(standardTags, options.customTags, standardTags);
  }

  return standardTags;
}

/**
 * Convert StandardTags to CloudFormation tag format
 * This is useful when you need to pass tags to CDK constructs that expect CloudFormation tag arrays
 *
 * @param tags - Standard tags object
 * @returns Array of CloudFormation tag objects with key/value properties
 */
export function convertToCfnTags(tags: StandardTags): Array<{ key: string; value: string }> {
  return Object.entries(tags)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => ({
      key: String(key).slice(0, 128),
      value: String(value).slice(0, 256),
    }));
}

/**
 * Validate tag key and value according to AWS tagging rules
 *
 * @param key - Tag key to validate
 * @param value - Tag value to validate
 * @returns Object with validated key and value, or null if invalid
 */
export function validateTag(key: string, value: unknown): { key: string; value: string } | null {
  if (!key) return null;

  const k = String(key).slice(0, 128);
  const v = String(value ?? '').slice(0, 256);

  if (!v) return null;

  return { key: k, value: v };
}

/**
 * Merge multiple tag objects with validation
 * Later objects take precedence over earlier ones
 *
 * @param tagObjects - Array of tag objects to merge
 * @returns Merged and validated tags object
 */
export function mergeTags(
  ...tagObjects: Array<Record<string, unknown> | undefined>
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const tags of tagObjects) {
    if (!tags) continue;

    for (const [key, value] of Object.entries(tags)) {
      const validated = validateTag(key, value);
      if (validated) {
        result[validated.key] = validated.value;
      }
    }
  }

  return result;
}
