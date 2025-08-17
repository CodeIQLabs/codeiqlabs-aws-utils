import { z } from 'zod';
import { ProjectNameSchema, CompanyNameSchema } from '../base';
import { ManagementConfigSchema } from '../resources/accounts';
import { DeploymentPermissionsSchema } from '../resources/deployment-permissions';

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
export const WorkloadAppConfigSchema = z.object({
  project: ProjectNameSchema,
  company: CompanyNameSchema,
  management: ManagementConfigSchema,
  deploymentPermissions: DeploymentPermissionsSchema.optional(),
});

export type WorkloadAppConfig = z.infer<typeof WorkloadAppConfigSchema>;
