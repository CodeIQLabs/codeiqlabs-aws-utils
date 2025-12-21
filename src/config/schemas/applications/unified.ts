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
  GitHubDeployPermissionsSchema,
  GitHubOidcConfigSchema,
  EcsComputeConfigSchema,
  AuroraConfigSchema,
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
 * naming:
 *   company: "CodeIQLabs"
 *   project: "Core"
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
 * naming:
 *   company: "CodeIQLabs"
 *   project: "SaaS"
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
 * networking:
 *   vpc:
 *     enabled: true
 * ```
 *
 * @example Mixed deployment (management + workload components)
 * ```yaml
 * naming:
 *   company: "CodeIQLabs"
 *   project: "Customization"
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
 * githubOidc:
 *   enabled: true
 * ```
 */

// DeploymentTargetSchema is imported from '../base'

/**
 * Naming configuration schema
 * Defines company and project names used for stack and resource naming
 */
export const NamingConfigSchema = z.object({
  /**
   * Company name - used in stack names (e.g., CodeIQLabs)
   */
  company: CompanyNameSchema,

  /**
   * Project name - used in stack names (e.g., SaaS, Core, Customization)
   */
  project: ProjectNameSchema,

  /**
   * Owner name - used for the Owner tag on resources
   * Represents the team or individual responsible for the resources.
   * If not specified, defaults to the company name.
   * @example "Platform Team", "DevOps", "John Smith"
   */
  owner: z.string().min(1).optional(),
});

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
   * Naming configuration - defines company and project for stack/resource naming
   * Pattern: {company}-{project}-{environment}-{component}-Stack
   */
  naming: NamingConfigSchema,

  /**
   * Primary deployment target
   * Used for single-account components (organization, identityCenter, domains)
   */
  deployment: DeploymentTargetSchema,

  /**
   * Optional: Multi-environment deployment configurations
   * Used for components that deploy to multiple accounts (networking, etc.)
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
   * GitHub deploy permissions configuration (legacy)
   * Enables GitHub OIDC + deploy roles for SaaS UI deployments
   */
  githubDeployPermissions: GitHubDeployPermissionsSchema.optional(),

  /**
   * GitHub OIDC configuration
   * Creates GitHub Actions OIDC identity provider and IAM roles in workload accounts
   * for CI/CD deployments without long-lived credentials
   */
  githubOidc: GitHubOidcConfigSchema.optional(),

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
          cidr: z.string().optional(),
          maxAzs: z.number().min(1).max(3).optional(),
          natGateways: z.number().min(0).max(3).optional(),
          enableFlowLogs: z.boolean().optional(),
          flowLogsRetentionDays: z.number().optional(),
        })
        .optional(),
    })
    .optional(),

  /**
   * Compute configuration
   * Deploys ECS Fargate services with shared ALB for multi-brand applications
   * Creates ECR repositories, ECS services, ALB with path-based routing
   */
  compute: z
    .object({
      ecs: EcsComputeConfigSchema.optional(),
    })
    .optional(),

  /**
   * Database configuration
   * Aurora Serverless v2 cluster hosting multiple brand databases
   */
  aurora: AuroraConfigSchema.optional(),

  /**
   * Static hosting configuration
   * Creates S3 buckets for static web app hosting (Expo Web builds)
   * CloudFront distribution is created in Management account
   */
  staticHosting: z
    .object({
      enabled: z.boolean(),
      /**
       * Management account ID for CloudFront OAC access
       */
      managementAccountId: AwsAccountIdSchema.optional(),
      /**
       * Static site configuration for each brand
       */
      sites: z
        .array(
          z.object({
            brand: z.string(),
            /**
             * Enable S3 bucket versioning for data protection
             * Recommended for production environments to enable recovery from accidental deletions
             * @default true
             */
            enableVersioning: z.boolean().default(true),
          }),
        )
        .optional(),
    })
    .optional(),

  /**
   * Secrets configuration
   * Creates AWS Secrets Manager secrets for application configuration
   * Secrets are created with placeholder values that need to be updated after deployment
   */
  secrets: z
    .object({
      enabled: z.boolean(),
      /**
       * Secret retention period in days when deleted
       * @default 7
       */
      recoveryWindowInDays: z.number().min(7).max(30).optional(),
      /**
       * List of brands for per-brand secrets
       * Used when a secret item has perBrand: true
       */
      brands: z.array(z.string()).optional(),
      /**
       * Secret items to create
       */
      items: z
        .array(
          z.object({
            /**
             * Secret key - used in the secret name: {project}/{env}/{key}
             */
            key: z.string(),
            /**
             * Human-readable description of the secret
             */
            description: z.string().optional(),
            /**
             * If true, auto-generate a random secret value
             * @default false
             */
            generated: z.boolean().optional(),
            /**
             * Length of generated secret (only used when generated: true)
             * @default 32
             */
            length: z.number().min(16).max(128).optional(),
            /**
             * If true, create one secret per brand: {project}/{env}/{key}/{brand}
             * Requires brands array to be defined
             * @default false
             */
            perBrand: z.boolean().optional(),
            /**
             * If provided, creates a JSON secret with these fields as keys
             * Each field gets a placeholder value
             */
            jsonFields: z.array(z.string()).optional(),
          }),
        )
        .optional(),
    })
    .optional(),

  /**
   * Origin zones configuration
   * Creates Route53 hosted zones for origin-{env}.{brand} subdomains
   * Used for stable ALB origin hostnames that CloudFront can reference
   */
  originZones: z
    .object({
      enabled: z.boolean(),
      /**
       * Brand domains to create origin zones for
       * Creates zones like: origin-nprd.savvue.com, origin-prod.savvue.com
       */
      brands: z.array(z.string()),
    })
    .optional(),
});

/**
 * Type inference for the unified application configuration
 */
export type UnifiedAppConfig = z.infer<typeof UnifiedAppConfigSchema>;
export type NamingConfig = z.infer<typeof NamingConfigSchema>;
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
