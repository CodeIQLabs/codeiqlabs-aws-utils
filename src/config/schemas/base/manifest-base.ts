// NEW FILE - Base schema for all manifest types
import { z } from 'zod';
import {
  ProjectNameSchema,
  CompanyNameSchema,
  AwsAccountIdSchema,
  AwsRegionSchema,
  EnvironmentSchema,
} from './index';

/**
 * Core fields required in every manifest file across the CodeIQLabs ecosystem
 */
export const ManifestCoreSchema = z.object({
  project: ProjectNameSchema,
  company: CompanyNameSchema,
});

/**
 * Environment/account context required in every manifest
 */
export const ManifestContextSchema = z.object({
  accountId: AwsAccountIdSchema,
  region: AwsRegionSchema,
  environment: EnvironmentSchema,
});

/**
 * Deployment target configuration
 * Specifies where resources should be deployed
 */
export const DeploymentTargetSchema = z.object({
  accountId: AwsAccountIdSchema,
  region: AwsRegionSchema,
});

/**
 * Base schema that all manifest types must extend
 * Includes only the core fields (project, company)
 */
export const ManifestBaseSchema = ManifestCoreSchema;

export type ManifestCore = z.infer<typeof ManifestCoreSchema>;
export type ManifestContext = z.infer<typeof ManifestContextSchema>;
export type DeploymentTarget = z.infer<typeof DeploymentTargetSchema>;
export type ManifestBase = z.infer<typeof ManifestBaseSchema>;
