import { z } from 'zod';
import { AwsAccountIdSchema, AwsRegionSchema, NameSchema } from '../base';

/**
 * Project configuration schemas for CodeIQLabs AWS projects
 *
 * This module provides validation schemas for project and environment
 * configurations that define how CodeIQLabs projects are structured
 * across different AWS accounts and regions.
 */

/**
 * Project environment configuration
 * Defines a specific environment (np, prod) for a project
 */
export const ProjectEnvironmentSchema = z.object({
  name: z.string().min(1, 'Environment name is required'),
  accountId: AwsAccountIdSchema,
  region: AwsRegionSchema,
});

export type ProjectEnvironment = z.infer<typeof ProjectEnvironmentSchema>;

/**
 * Project configuration
 * Defines a project with its environments and settings
 */
export const ProjectSchema = z.object({
  name: NameSchema,
  environments: z.array(ProjectEnvironmentSchema).min(1, 'At least one environment is required'),
});

export type Project = z.infer<typeof ProjectSchema>;
