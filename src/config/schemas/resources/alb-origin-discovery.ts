import { z } from 'zod';
import { ProjectSchema } from './projects';

/**
 * ALB Origin Discovery configuration schemas for CodeIQLabs AWS projects
 *
 * This module provides validation schemas for ALB origin discovery configuration
 * that enables the Management account's Lambda to read SSM parameters from
 * workload accounts to discover ALB DNS names for CloudFront origin configuration.
 */

/**
 * ALB Origin Discovery configuration
 * Defines the configuration for cross-account ALB origin discovery
 * used by centralized CloudFront distributions
 */
export const AlbOriginDiscoverySchema = z.object({
  /**
   * Whether ALB origin discovery is enabled
   */
  enabled: z.boolean().default(true),

  /**
   * SSM parameter path prefix for ALB DNS parameters
   * The Management account Lambda will be granted read access to parameters
   * matching this prefix in workload accounts
   * @default "/codeiqlabs/*"
   */
  ssmParameterPrefix: z.string().default('/codeiqlabs/*'),

  /**
   * Projects and their workload account environments
   * Each environment will have an OriginDiscoveryReadRole created
   * that allows the Management account to read SSM parameters
   */
  projects: z.array(ProjectSchema).min(1, 'At least one project is required'),
});

export type AlbOriginDiscovery = z.infer<typeof AlbOriginDiscoverySchema>;
