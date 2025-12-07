import { z } from 'zod';
import { AwsAccountIdSchema, AwsRegionSchema } from '../base';

/**
 * ALB Origin Discovery configuration schemas
 *
 * This module provides validation schemas for ALB origin discovery configuration
 * that enables the Management account's Lambda to read SSM parameters from
 * workload accounts to discover ALB DNS names for CloudFront origin configuration.
 */

/**
 * Environment configuration for ALB Origin Discovery
 */
export const AlbOriginDiscoveryEnvironmentSchema = z.object({
  name: z.string().min(1, 'Environment name is required'),
  accountId: AwsAccountIdSchema,
  region: AwsRegionSchema,
});

export type AlbOriginDiscoveryEnvironment = z.infer<typeof AlbOriginDiscoveryEnvironmentSchema>;

/**
 * Target configuration for ALB Origin Discovery
 * Defines a project and its environments for origin discovery
 */
export const AlbOriginDiscoveryTargetSchema = z.object({
  projectName: z.string().min(1, 'Project name is required'),
  environments: z
    .array(AlbOriginDiscoveryEnvironmentSchema)
    .min(1, 'At least one environment is required'),
});

export type AlbOriginDiscoveryTarget = z.infer<typeof AlbOriginDiscoveryTargetSchema>;

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
   * matching this prefix in workload accounts.
   *
   * Should be derived from company name: /{company}/*
   * If not provided, will be derived from manifest naming.company
   */
  ssmParameterPrefix: z.string().optional(),

  /**
   * Targets (projects and their workload account environments)
   * Each environment will have an OriginDiscoveryReadRole created
   * that allows the Management account to read SSM parameters
   */
  targets: z.array(AlbOriginDiscoveryTargetSchema).min(1, 'At least one target is required'),
});

export type AlbOriginDiscovery = z.infer<typeof AlbOriginDiscoverySchema>;
