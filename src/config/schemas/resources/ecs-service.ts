import { z } from 'zod';

/**
 * ECS Service configuration schemas for CodeIQLabs AWS projects
 *
 * This module provides validation schemas for ECS service configurations
 * including service types, brands, and compute settings.
 */

/**
 * ECS Service Type
 * Determines routing behavior and resource configuration
 */
export const EcsServiceTypeSchema = z.enum(['webapp', 'api', 'worker']);
export type EcsServiceType = z.infer<typeof EcsServiceTypeSchema>;

/**
 * Individual ECS Service Configuration
 */
export const EcsServiceSchema = z
  .object({
    /**
     * Optional service name override used for resource naming
     * Defaults to the service type when not provided
     */
    name: z.string().min(1).optional(),

    /**
     * Service type - determines routing and caching behavior
     * - webapp: Multi-brand frontend, path-based routing
     * - api: Single service, dedicated ALB
     * - worker: Background worker, no ALB
     */
    type: EcsServiceTypeSchema,

    /**
     * Whether this service is enabled
     * @default true
     */
    enabled: z.boolean().default(true),

    /**
     * List of brands for multi-brand services (type: 'webapp' only)
     * Each brand gets its own ECS service with path-based routing.
     *
     * Required for type: 'webapp' (validated by .refine())
     * Not needed for type: 'api' or 'worker'
     */
    brands: z.array(z.string()).optional(),

    /**
     * Default brand for the service (type: 'webapp' only)
     * Must be one of the entries in brands array (validated by .refine())
     */
    defaultBrand: z.string().optional(),

    /**
     * Container port
     * @default 3000
     */
    containerPort: z.number().min(1).max(65535).default(3000),

    /**
     * Health check path
     * @default '/health'
     */
    healthCheckPath: z.string().default('/health'),

    /**
     * Desired task count
     * @default 1
     */
    desiredCount: z.number().min(0).default(1),

    /**
     * CPU units (256, 512, 1024, 2048, 4096)
     * @default 256
     */
    cpu: z.number().default(256),

    /**
     * Memory in MB
     * @default 512
     */
    memoryMiB: z.number().default(512),
  })
  // Validation: 'web' type services must have brands
  .refine(
    (data) => {
      if (data.type === 'webapp') {
        return data.brands && data.brands.length > 0;
      }
      return true;
    },
    { message: "Services with type 'webapp' must specify at least one brand" },
  )
  // Validation: defaultBrand must be one of the entries in brands
  .refine(
    (data) => {
      if (data.defaultBrand) {
        return data.brands && data.brands.includes(data.defaultBrand);
      }
      return true;
    },
    { message: 'defaultBrand must be one of the entries in brands array' },
  );

export type EcsService = z.infer<typeof EcsServiceSchema>;

/**
 * ECS Compute Configuration with services array
 *
 * Note: managementAccountId is NOT needed here - it was never used in ECS stacks.
 * It IS needed in staticHosting config (for S3 bucket policy) and albOriginDiscovery
 * (for IAM trust policy), but not for ECS services.
 */
export const EcsComputeConfigSchema = z.object({
  enabled: z.boolean(),

  /**
   * ACM certificate ARN from Management account for ALB HTTPS
   * Optional - CloudFront handles SSL termination, so ALB can use HTTP
   */
  certificateArn: z.string().optional(),

  /**
   * Array of ECS services to deploy
   */
  services: z.array(EcsServiceSchema).min(1, 'At least one service is required'),
});

export type EcsComputeConfig = z.infer<typeof EcsComputeConfigSchema>;
