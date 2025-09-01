import { z } from 'zod';
import { ManifestBaseSchema } from '../base';
import { OrganizationSchema } from '../resources';
import { IdentityCenterSchema } from '../resources';

/**
 * Management application configuration schema for CodeIQLabs AWS projects
 *
 * This schema defines the foundational organizational infrastructure configuration
 * that should be deployed to the AWS management account. It establishes the
 * organizational structure, identity management, and governance foundations for
 * all other accounts in the organization.
 *
 * The management configuration includes:
 * - AWS Organizations setup with organizational units and service control policies
 * - AWS Identity Center (SSO) configuration for centralized identity management
 * - Cross-account role definitions for workload account access
 * - Account creation and management policies
 * - Organizational governance and compliance settings
 *
 * This configuration should be deployed first in the four-schema deployment sequence
 * as it establishes the organizational foundation that other account types depend on.
 *
 * Deployment Sequence Position: 1st (Foundation)
 * Dependencies: None (this is the root organizational configuration)
 * Dependents: All other account types (shared-services, baseline, workload)
 */

/**
 * Management application configuration schema
 *
 * Combines all organizational governance components into a single
 * configuration that establishes the AWS organization foundation.
 */
export const ManagementAppConfigSchema = ManifestBaseSchema.extend({
  /**
   * Application type identifier
   */
  type: z.literal('management'),

  /**
   * AWS Organizations configuration
   * Defines organizational units, service control policies, and account management
   */
  organization: OrganizationSchema,

  /**
   * AWS Identity Center (SSO) configuration
   * Defines centralized identity management, permission sets, and account assignments
   */
  identityCenter: IdentityCenterSchema,

  /**
   * Additional management configuration options
   */
  options: z
    .object({
      /**
       * Whether to enable all AWS services by default in new accounts
       */
      enableAllAwsServices: z.boolean().default(true),

      /**
       * Whether to automatically create cross-account roles in new accounts
       */
      autoCreateCrossAccountRoles: z.boolean().default(true),

      /**
       * Whether to enable CloudTrail organization trail
       */
      enableOrganizationCloudTrail: z.boolean().default(true),

      /**
       * Whether to enable AWS Config organization conformance packs
       */
      enableOrganizationConfig: z.boolean().default(true),

      /**
       * Whether to enable GuardDuty organization features
       */
      enableOrganizationGuardDuty: z.boolean().default(true),

      /**
       * Whether to enable Security Hub organization features
       */
      enableOrganizationSecurityHub: z.boolean().default(true),

      /**
       * Default tags to apply to all organizational resources
       */
      defaultTags: z.record(z.string()).optional(),

      /**
       * Resource naming prefix for management account resources
       */
      resourcePrefix: z.string().optional(),

      /**
       * Whether to require MFA for all Identity Center users
       */
      requireMfaForIdentityCenter: z.boolean().default(true),

      /**
       * Session duration for Identity Center permission sets (in hours)
       */
      defaultSessionDuration: z.number().int().min(1).max(12).default(8),

      /**
       * Whether to enable trusted access for AWS services
       */
      enableTrustedAccess: z.boolean().default(true),
    })
    .optional(),
});

/**
 * Type inference for the management application configuration
 */
export type ManagementAppConfig = z.infer<typeof ManagementAppConfigSchema>;

/**
 * Validation function for management application configuration
 *
 * @param config - The configuration object to validate
 * @returns Validated and typed configuration object
 * @throws ZodError if validation fails
 */
export function validateManagementAppConfig(config: unknown): ManagementAppConfig {
  return ManagementAppConfigSchema.parse(config);
}

/**
 * Safe validation function for management application configuration
 *
 * @param config - The configuration object to validate
 * @returns Success result with validated config or error result with validation issues
 */
export function safeValidateManagementAppConfig(config: unknown) {
  return ManagementAppConfigSchema.safeParse(config);
}
