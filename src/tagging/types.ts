/**
 * Type definitions for AWS resource tagging utilities
 *
 * This module provides type definitions for standardized tagging across
 * CodeIQLabs AWS resources, ensuring consistent tag structure and validation.
 */

// ============================================================================
// Environment and Validation Types
// ============================================================================

// Import and re-export environment constants from centralized location
import type { Environment } from '../constants/environments';
export { ENV_VALUES, validateEnvironment } from '../constants/environments';
export type { Environment } from '../constants/environments';

// Alias for backward compatibility in tagging context
export type EnvironmentTag = Environment;

// ============================================================================
// Tag Structure Types
// ============================================================================

/**
 * Extra tags that can be applied to AWS resources
 * This is a flexible record type for custom tags beyond the standard ones
 */
export type ExtraTags = Record<string, string | undefined>;

/**
 * Options for configuring tag generation
 * Used by the generateStandardTags function and related utilities
 */
export interface TaggingOptions {
  /** Component name (required for standard tags) */
  component?: string;
  /** Application name (optional, defaults to project name) */
  application?: string;
  /** Owner name or team (configurable, no default) */
  owner?: string;
  /** Company/organization name (configurable, no default) */
  company?: string;
  /** Owner email address */
  ownerEmail?: string;
  /** Cost center for billing/chargeback */
  costCenter?: string;
  /** Data classification level */
  dataClassification?: string;
  /** Repository name */
  repo?: string;
  /** Deployment tool (defaults to "CDK") */
  managedBy?: string;
  /** Additional custom tags */
  customTags?: ExtraTags;
}

/**
 * Standard Tag Structure for AWS Resources
 *
 * Enforces consistent tagging across all AWS resources following enterprise standards:
 * - App: Short product/app name (e.g., MyProject, BudgetTrack)
 * - Environment: nprd, prod, mgmt, shared, or pprd
 * - Component: System slice (e.g., Network, Data, Api, Frontend)
 * - Owner: Team or person (configurable)
 * - OwnerEmail: Optional alias email
 * - CostCenter: For showback/chargeback
 * - ManagedBy: Deployment tool (e.g., CDK, Terraform)
 * - Company: Organization name (configurable)
 * - DataClassification: Public, Internal, Confidential
 * - Repo: Short repo name
 */
export interface StandardTags {
  App: string; // Short product/app name
  Environment: EnvironmentTag; // nprd, prod, mgmt, shared, or pprd
  Component: string; // System slice
  Owner: string; // Team or person (configurable)
  OwnerEmail?: string; // Optional alias email
  CostCenter?: string; // For billing/chargeback
  ManagedBy: string; // Deployment tool
  Company: string; // Organization name (configurable)
  DataClassification?: string; // Public, Internal, Confidential
  Repo?: string; // Short repo name
}

/**
 * @deprecated Use StandardTags instead. This alias is kept for backward compatibility.
 */
export type CodeIQLabsStandardTags = StandardTags;
