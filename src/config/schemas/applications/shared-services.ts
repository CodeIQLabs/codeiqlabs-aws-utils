import { z } from 'zod';
import { ManifestBaseSchema } from '../base';

/**
 * Shared services application configuration schema for CodeIQLabs AWS projects
 *
 * This schema defines the centralized services infrastructure configuration that
 * should be deployed to a dedicated shared services account. It provides common
 * services and infrastructure components that are shared across all workload
 * accounts in the organization.
 *
 * The shared services configuration includes:
 * - Centralized monitoring and logging infrastructure (CloudWatch, X-Ray)
 * - Cross-account networking services (Transit Gateway, VPC peering)
 * - Shared security services (Certificate Manager, Secrets Manager)
 * - Centralized backup and disaster recovery services
 * - Shared development tools and artifact storage
 * - Cost management and billing consolidation services
 *
 * This configuration should be deployed second in the four-schema deployment sequence,
 * after the management account is established but before workload accounts are configured.
 * It provides shared infrastructure that workload accounts can connect to and utilize.
 *
 * Deployment Sequence Position: 2nd (Shared Infrastructure)
 * Dependencies: Management account (for cross-account access)
 * Dependents: Baseline and workload accounts (can utilize shared services)
 */

/**
 * Monitoring and observability services configuration
 */
export const MonitoringServicesSchema = z.object({
  enabled: z.boolean().default(true),
  centralLogging: z.boolean().default(true),
  crossAccountAccess: z.boolean().default(true),
  logRetentionDays: z.number().int().min(1).max(3653).default(365),
  enableXRayTracing: z.boolean().default(true),
  enableCloudWatchInsights: z.boolean().default(true),
  enableContainerInsights: z.boolean().default(true),
});

/**
 * Networking services configuration
 */
export const NetworkingServicesSchema = z.object({
  transitGateway: z
    .object({
      enabled: z.boolean().default(false),
      asn: z.number().int().min(64512).max(65534).optional(),
      enableDnsSupport: z.boolean().default(true),
      enableMulticast: z.boolean().default(false),
      defaultRouteTableAssociation: z.enum(['enable', 'disable']).default('enable'),
      defaultRouteTablePropagation: z.enum(['enable', 'disable']).default('enable'),
    })
    .optional(),
  vpcPeering: z
    .object({
      enabled: z.boolean().default(false),
      autoAcceptPeering: z.boolean().default(true),
    })
    .optional(),
  directConnect: z
    .object({
      enabled: z.boolean().default(false),
      virtualInterfaces: z.array(z.string()).optional(),
    })
    .optional(),
});

/**
 * Security services configuration
 */
export const SecurityServicesSchema = z.object({
  certificateManager: z
    .object({
      enabled: z.boolean().default(true),
      crossAccountSharing: z.boolean().default(true),
    })
    .optional(),
  secretsManager: z
    .object({
      enabled: z.boolean().default(true),
      crossAccountAccess: z.boolean().default(true),
      automaticRotation: z.boolean().default(true),
    })
    .optional(),
  kmsKeySharing: z
    .object({
      enabled: z.boolean().default(true),
      defaultKeyPolicy: z.record(z.any()).optional(),
    })
    .optional(),
});

/**
 * Backup and disaster recovery services configuration
 */
export const BackupServicesSchema = z.object({
  enabled: z.boolean().default(true),
  crossAccountBackup: z.boolean().default(true),
  backupVault: z
    .object({
      name: z.string().optional(),
      kmsKeyId: z.string().optional(),
    })
    .optional(),
  defaultBackupPlan: z
    .object({
      enabled: z.boolean().default(true),
      retentionDays: z.number().int().min(1).max(36500).default(30),
    })
    .optional(),
});

/**
 * Development and artifact storage services configuration
 */
export const DevOpsServicesSchema = z.object({
  artifactStore: z
    .object({
      enabled: z.boolean().default(true),
      crossAccountAccess: z.boolean().default(true),
      s3BucketEncryption: z.boolean().default(true),
      versioningEnabled: z.boolean().default(true),
    })
    .optional(),
  containerRegistry: z
    .object({
      enabled: z.boolean().default(true),
      crossAccountAccess: z.boolean().default(true),
      imageScanningEnabled: z.boolean().default(true),
      lifecyclePolicyEnabled: z.boolean().default(true),
    })
    .optional(),
});

/**
 * Shared services specific configuration
 */
export const SharedServicesConfigSchema = z.object({
  services: z
    .object({
      monitoring: MonitoringServicesSchema.optional(),
      networking: NetworkingServicesSchema.optional(),
      security: SecurityServicesSchema.optional(),
      backup: BackupServicesSchema.optional(),
      devops: DevOpsServicesSchema.optional(),
    })
    .optional(),
});

/**
 * Shared services application configuration schema
 *
 * Combines all shared services components into a single
 * configuration that can be deployed to establish centralized services.
 */
export const SharedServicesAppConfigSchema = ManifestBaseSchema.extend({
  /**
   * Application type identifier
   */
  type: z.literal('shared-services'),

  /**
   * Shared services configuration
   * Defines all centralized services and their configurations
   */
  sharedServices: SharedServicesConfigSchema,

  /**
   * Additional shared services configuration options
   */
  options: z
    .object({
      /**
       * Whether to enable cross-account resource sharing by default
       */
      enableCrossAccountSharing: z.boolean().default(true),

      /**
       * Whether to create default IAM roles for cross-account access
       */
      createDefaultCrossAccountRoles: z.boolean().default(true),

      /**
       * Whether to enable cost allocation tags for shared resources
       */
      enableCostAllocationTags: z.boolean().default(true),

      /**
       * Whether to enable resource sharing via AWS Resource Access Manager
       */
      enableResourceAccessManager: z.boolean().default(true),

      /**
       * Default tags to apply to all shared services resources
       */
      defaultTags: z.record(z.string()).optional(),

      /**
       * Resource naming prefix for shared services resources
       */
      resourcePrefix: z.string().optional(),

      /**
       * Whether to enable automated backup for shared services
       */
      enableAutomatedBackup: z.boolean().default(true),

      /**
       * Whether to enable monitoring and alerting for shared services
       */
      enableMonitoringAlerts: z.boolean().default(true),

      /**
       * Default retention period for logs and backups (in days)
       */
      defaultRetentionDays: z.number().int().min(1).max(3653).default(365),
    })
    .optional(),
});

/**
 * Type inference for the shared services application configuration
 */
export type SharedServicesAppConfig = z.infer<typeof SharedServicesAppConfigSchema>;

/**
 * Validation function for shared services application configuration
 *
 * @param config - The configuration object to validate
 * @returns Validated and typed configuration object
 * @throws ZodError if validation fails
 */
export function validateSharedServicesAppConfig(config: unknown): SharedServicesAppConfig {
  return SharedServicesAppConfigSchema.parse(config);
}

/**
 * Safe validation function for shared services application configuration
 *
 * @param config - The configuration object to validate
 * @returns Success result with validated config or error result with validation issues
 */
export function safeValidateSharedServicesAppConfig(config: unknown) {
  return SharedServicesAppConfigSchema.safeParse(config);
}
