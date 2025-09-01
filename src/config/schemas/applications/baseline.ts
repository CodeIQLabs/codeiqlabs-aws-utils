import { z } from 'zod';
import { ManifestBaseSchema } from '../base';
import { NetworkingConfigSchema } from '../resources/networking';
import { SecurityConfigSchema } from '../resources/security';
import { ComplianceConfigSchema } from '../resources/compliance';

/**
 * Baseline application configuration schema for CodeIQLabs AWS projects
 *
 * This schema defines the foundational infrastructure configuration that should be
 * deployed to every workload account before application-specific infrastructure.
 * It ensures consistent networking, security, and compliance foundations across
 * all AWS accounts in the organization.
 *
 * The baseline configuration includes:
 * - VPC and networking setup (subnets, routing, gateways)
 * - Security configurations (security groups, NACLs, IAM roles, KMS)
 * - Compliance and monitoring (CloudTrail, Config, GuardDuty, Security Hub)
 * - Reference to management account for cross-account access
 *
 * This configuration should be deployed before any workload-specific infrastructure
 * to provide a consistent foundation for all applications.
 */

/**
 * Baseline application configuration schema
 *
 * Combines all foundational infrastructure components into a single
 * configuration that can be deployed to establish account baselines.
 */
export const BaselineAppConfigSchema = ManifestBaseSchema.extend({
  /**
   * Application type identifier
   */
  type: z.literal('baseline'),

  /**
   * Networking configuration
   * Defines VPC, subnets, routing, gateways, and network security
   */
  networking: NetworkingConfigSchema,

  /**
   * Security configuration
   * Defines security groups, NACLs, IAM roles, KMS keys, and security policies
   */
  security: SecurityConfigSchema.optional(),

  /**
   * Compliance and monitoring configuration
   * Defines CloudTrail, Config, GuardDuty, Security Hub, and other compliance tools
   */
  compliance: ComplianceConfigSchema.optional(),

  /**
   * Additional baseline configuration options
   */
  options: z
    .object({
      /**
       * Whether to create default security groups and NACLs
       */
      createDefaultSecurityResources: z.boolean().default(true),

      /**
       * Whether to enable VPC Flow Logs by default
       */
      enableVpcFlowLogs: z.boolean().default(true),

      /**
       * Whether to create default KMS keys for encryption
       */
      createDefaultKmsKeys: z.boolean().default(true),

      /**
       * Whether to enable all compliance services by default
       */
      enableAllComplianceServices: z.boolean().default(true),

      /**
       * Default tags to apply to all baseline resources
       */
      defaultTags: z.record(z.string()).optional(),

      /**
       * Resource naming prefix for baseline resources
       */
      resourcePrefix: z.string().optional(),
    })
    .optional(),
});

/**
 * Type inference for the baseline application configuration
 */
export type BaselineAppConfig = z.infer<typeof BaselineAppConfigSchema>;

/**
 * Validation function for baseline application configuration
 *
 * @param config - The configuration object to validate
 * @returns Validated and typed configuration object
 * @throws ZodError if validation fails
 */
export function validateBaselineAppConfig(config: unknown): BaselineAppConfig {
  return BaselineAppConfigSchema.parse(config);
}

/**
 * Safe validation function for baseline application configuration
 *
 * @param config - The configuration object to validate
 * @returns Success result with validated config or error result with validation issues
 */
export function safeValidateBaselineAppConfig(config: unknown) {
  return BaselineAppConfigSchema.safeParse(config);
}
