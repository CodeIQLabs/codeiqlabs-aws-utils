import { z } from 'zod';
import { DeploymentPermissionsSchema } from '../resources';
import {
  AwsAccountIdSchema,
  AwsRegionSchema,
  EnvironmentSchema,
  ManifestBaseSchema,
} from '../base';

/**
 * Workload application configuration schema for CodeIQLabs AWS projects
 *
 * This schema defines the application-specific infrastructure configuration that
 * should be deployed to workload accounts. It manages the deployment of business
 * applications and their supporting infrastructure on top of the baseline
 * foundation established by the baseline schema.
 *
 * The workload configuration includes:
 * - Multi-environment deployment configurations (dev, staging, prod)
 * - Application-specific infrastructure (APIs, databases, compute resources)
 * - Environment-specific settings and scaling configurations
 * - Cross-account deployment permissions and GitHub Actions integration
 * - Application monitoring, logging, and alerting configurations
 * - Environment-specific security and compliance overrides
 *
 * This configuration should be deployed last in the four-schema deployment sequence,
 * after the baseline infrastructure is established in the workload accounts.
 * It assumes that foundational networking, security, and compliance infrastructure
 * is already in place via the baseline schema.
 *
 * Deployment Sequence Position: 4th (Application Infrastructure)
 * Dependencies: Management account, baseline infrastructure in workload accounts
 * Dependents: None (this is the final application layer)
 */

/**
 * Environment-specific configuration for workload deployments
 */
export const WorkloadEnvironmentSchema = z.object({
  /**
   * AWS account ID for this environment
   */
  accountId: AwsAccountIdSchema,

  /**
   * Primary AWS region for this environment
   */
  region: AwsRegionSchema,

  /**
   * Environment type (nprd, prod, pprd, etc.)
   */
  environment: EnvironmentSchema,

  /**
   * Environment-specific configuration overrides
   */
  config: z
    .object({
      /**
       * Scaling configuration for this environment
       */
      scaling: z
        .object({
          minCapacity: z.number().int().min(0).optional(),
          maxCapacity: z.number().int().min(1).optional(),
          targetUtilization: z.number().min(0).max(100).optional(),
        })
        .optional(),

      /**
       * Monitoring configuration for this environment
       */
      monitoring: z
        .object({
          enableDetailedMonitoring: z.boolean().default(true),
          logLevel: z.enum(['DEBUG', 'INFO', 'WARN', 'ERROR']).default('INFO'),
          enableXRayTracing: z.boolean().default(true),
        })
        .optional(),

      /**
       * Security configuration overrides for this environment
       */
      security: z
        .object({
          enableWaf: z.boolean().default(true),
          enableShield: z.boolean().default(false),
          enableGuardDuty: z.boolean().default(true),
        })
        .optional(),

      /**
       * Backup configuration for this environment
       */
      backup: z
        .object({
          enabled: z.boolean().default(true),
          retentionDays: z.number().int().min(1).max(36500).default(30),
          crossRegionBackup: z.boolean().default(false),
        })
        .optional(),
    })
    .optional(),
});

/**
 * Application deployment configuration
 */
export const ApplicationConfigSchema = z.object({
  /**
   * Application name and metadata
   */
  name: z.string().min(1).max(64),
  description: z.string().optional(),
  version: z.string().optional(),

  /**
   * Application type and runtime configuration
   */
  runtime: z
    .object({
      type: z.enum(['container', 'serverless', 'vm', 'static']).optional(),
      platform: z.string().optional(),
      version: z.string().optional(),
    })
    .optional(),

  /**
   * Application dependencies and integrations
   */
  dependencies: z
    .object({
      databases: z.array(z.string()).optional(),
      queues: z.array(z.string()).optional(),
      apis: z.array(z.string()).optional(),
      storage: z.array(z.string()).optional(),
    })
    .optional(),
});

/**
 * Workload application configuration schema
 *
 * Combines all application-specific components into a single
 * configuration that can be deployed to establish application infrastructure.
 */
export const WorkloadAppConfigSchema = ManifestBaseSchema.extend({
  /**
   * Application type identifier
   */
  type: z.literal('workload'),

  /**
   * Environment-specific deployment configurations
   * Maps environment names to their specific configurations
   */
  environments: z.record(WorkloadEnvironmentSchema),

  /**
   * Deployment permissions and GitHub Actions configuration
   * Defines how the application can be deployed across environments using GitHub Actions
   */
  deploymentPermissions: DeploymentPermissionsSchema.optional(),

  /**
   * Application-specific configuration
   * Defines the applications and services to be deployed
   */
  applications: z.array(ApplicationConfigSchema).optional(),

  /**
   * Additional workload configuration options
   */
  options: z
    .object({
      /**
       * Whether to enable blue-green deployments
       */
      enableBlueGreenDeployment: z.boolean().default(false),

      /**
       * Whether to enable canary deployments
       */
      enableCanaryDeployment: z.boolean().default(false),

      /**
       * Whether to enable automatic rollback on deployment failure
       */
      enableAutoRollback: z.boolean().default(true),

      /**
       * Whether to enable cross-region disaster recovery
       */
      enableDisasterRecovery: z.boolean().default(false),

      /**
       * Whether to enable automated testing in GitHub Actions
       */
      enableAutomatedTesting: z.boolean().default(true),

      /**
       * Whether to enable security scanning in GitHub Actions
       */
      enableSecurityScanning: z.boolean().default(true),

      /**
       * Default tags to apply to all workload resources
       */
      defaultTags: z.record(z.string()).optional(),

      /**
       * Resource naming prefix for workload resources
       */
      resourcePrefix: z.string().optional(),

      /**
       * Whether to enable cost optimization features
       */
      enableCostOptimization: z.boolean().default(true),

      /**
       * Whether to enable performance monitoring and optimization
       */
      enablePerformanceMonitoring: z.boolean().default(true),

      /**
       * Default environment promotion order
       */
      promotionOrder: z.array(z.string()).optional(),
    })
    .optional(),
});

/**
 * Type inference for the workload application configuration
 */
export type WorkloadAppConfig = z.infer<typeof WorkloadAppConfigSchema>;

/**
 * Validation function for workload application configuration
 *
 * @param config - The configuration object to validate
 * @returns Validated and typed configuration object
 * @throws ZodError if validation fails
 */
export function validateWorkloadAppConfig(config: unknown): WorkloadAppConfig {
  return WorkloadAppConfigSchema.parse(config);
}

/**
 * Safe validation function for workload application configuration
 *
 * @param config - The configuration object to validate
 * @returns Success result with validated config or error result with validation issues
 */
export function safeValidateWorkloadAppConfig(config: unknown) {
  return WorkloadAppConfigSchema.safeParse(config);
}
