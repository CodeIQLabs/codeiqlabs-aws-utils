import { z } from 'zod';
import { ManagementConfigSchema } from '../resources';
import { DeploymentPermissionsSchema } from '../resources';
import {
  AwsAccountIdSchema,
  AwsRegionSchema,
  EnvironmentSchema,
  ManifestBaseSchema,
} from '../base';

/**
 * Workload application configuration schemas for CodeIQLabs AWS projects
 *
 * This module provides the root configuration schema for workload (customization)
 * projects. Individual component schemas are organized in separate files
 * following AWS CDK resource alignment for better maintainability.
 */

/**
 * Complete workload account configuration schema
 * This is the root schema for workload project configurations
 */
export const WorkloadAppConfigSchema = ManifestBaseSchema.merge(
  z.object({
    type: z.literal('workload'),
    environments: z.record(
      z.object({
        accountId: AwsAccountIdSchema,
        region: AwsRegionSchema,
        environment: EnvironmentSchema,
      }),
    ),
    management: ManagementConfigSchema,
    deploymentPermissions: DeploymentPermissionsSchema.optional(),
  }),
);

export type WorkloadAppConfig = z.infer<typeof WorkloadAppConfigSchema>;
