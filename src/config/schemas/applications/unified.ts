import { z } from 'zod';
import {
  ProjectNameSchema,
  CompanyNameSchema,
  DeploymentTargetSchema,
  AwsAccountIdSchema,
  AwsRegionSchema,
} from '../base';
import {
  OrganizationSchema,
  IdentityCenterSchema,
  DomainManagementSchema,
  DeploymentPermissionsSchema,
} from '../resources';

/**
 * Unified Application Configuration Schema for CodeIQLabs AWS Projects
 *
 * This schema replaces the previous manifestType-based approach with a unified,
 * component-based configuration. Any component can be deployed to any account,
 * removing artificial constraints between "management" and "workload" manifests.
 *
 * Key principles:
 * - No manifestType field - components define what gets deployed
 * - Primary deployment target for single-account components
 * - Optional environments section for multi-environment components
 * - All component sections are optional - enable what you need
 * - Maximum flexibility - deploy any combination of components
 *
 * @example Single-account deployment (e.g., management account)
 * ```yaml
 * project: codeiqlabs
 * company: codeiqlabs
 * deployment:
 *   accountId: "682475224767"
 *   region: us-east-1
 * organization:
 *   enabled: true
 * identityCenter:
 *   enabled: true
 * domains:
 *   enabled: true
 * ```
 *
 * @example Multi-environment deployment (e.g., workload account)
 * ```yaml
 * project: myapp
 * company: codeiqlabs
 * deployment:
 *   accountId: "466279485605"
 *   region: us-east-1
 * environments:
 *   nprd:
 *     accountId: "466279485605"
 *     region: us-east-1
 *   prod:
 *     accountId: "719640820326"
 *     region: us-east-1
 * staticHosting:
 *   enabled: true
 * networking:
 *   vpc:
 *     enabled: true
 * ```
 *
 * @example Mixed deployment (management + workload components)
 * ```yaml
 * project: codeiqlabs
 * company: codeiqlabs
 * deployment:
 *   accountId: "682475224767"
 *   region: us-east-1
 * environments:
 *   nprd:
 *     accountId: "466279485605"
 *     region: us-east-1
 *   prod:
 *     accountId: "719640820326"
 *     region: us-east-1
 * organization:
 *   enabled: true
 * identityCenter:
 *   enabled: true
 * domains:
 *   enabled: true
 * staticHosting:
 *   enabled: true
 * ```
 */

// DeploymentTargetSchema is imported from '../base'

/**
 * Environment-specific configuration for multi-environment deployments
 */
export const EnvironmentConfigSchema = z.object({
  /**
   * AWS account ID for this environment
   */
  accountId: AwsAccountIdSchema,

  /**
   * AWS region for this environment
   */
  region: AwsRegionSchema,

  /**
   * Optional environment-specific configuration
   */
  config: z.record(z.unknown()).optional(),
});

/**
 * Unified Application Configuration Schema
 *
 * This single schema supports all deployment patterns:
 * - Single-account deployments (management, shared services, etc.)
 * - Multi-environment deployments (workload applications)
 * - Mixed deployments (management account with workload components)
 *
 * Components are enabled by including them in the manifest with enabled: true
 */
export const UnifiedAppConfigSchema = z.object({
  /**
   * Project name - used for resource naming and tagging
   */
  project: ProjectNameSchema,

  /**
   * Company name - used for resource naming and tagging
   */
  company: CompanyNameSchema,

  /**
   * Primary deployment target
   * Used for single-account components (organization, identityCenter, domains)
   */
  deployment: DeploymentTargetSchema,

  /**
   * Optional: Multi-environment deployment configurations
   * Used for components that deploy to multiple accounts (staticHosting, networking, etc.)
   */
  environments: z.record(EnvironmentConfigSchema).optional(),

  // ============================================================================
  // COMPONENT SECTIONS - All Optional
  // Enable the components you need by including them with enabled: true
  // ============================================================================

  /**
   * AWS Organizations configuration
   * Typically deployed to organization management account
   * Defines organizational units, service control policies, and account management
   */
  organization: OrganizationSchema.optional(),

  /**
   * AWS Identity Center (SSO) configuration
   * Typically deployed to organization management account
   * Defines centralized identity management, permission sets, and account assignments
   */
  identityCenter: IdentityCenterSchema.optional(),

  /**
   * Domain management configuration
   * Can be deployed to any account
   * Defines centralized domain management, DNS delegation, and SSL certificates
   */
  domains: DomainManagementSchema.optional(),

  /**
   * Deployment permissions and GitHub Actions configuration
   * Can be deployed to any account
   * Defines how applications can be deployed using GitHub Actions
   */
  deploymentPermissions: DeploymentPermissionsSchema.optional(),

  /**
   * Static website hosting configuration
   * Deploys to environments defined in the environments section
   * Creates S3 buckets, CloudFront distributions, and custom domains
   */
  staticHosting: z
    .object({
      enabled: z.boolean(),
      // Additional static hosting configuration will be added here
    })
    .optional(),

  /**
   * Networking configuration
   * Deploys to environments defined in the environments section
   * Creates VPCs, subnets, security groups, and network infrastructure
   */
  networking: z
    .object({
      vpc: z
        .object({
          enabled: z.boolean(),
          // Additional VPC configuration will be added here
        })
        .optional(),
    })
    .optional(),
});

/**
 * Type inference for the unified application configuration
 */
export type UnifiedAppConfig = z.infer<typeof UnifiedAppConfigSchema>;
export type DeploymentTarget = z.infer<typeof DeploymentTargetSchema>;
export type EnvironmentConfig = z.infer<typeof EnvironmentConfigSchema>;

/**
 * Validation functions
 */
export function validateUnifiedAppConfig(config: unknown): UnifiedAppConfig {
  return UnifiedAppConfigSchema.parse(config);
}

export function safeValidateUnifiedAppConfig(config: unknown) {
  return UnifiedAppConfigSchema.safeParse(config);
}
