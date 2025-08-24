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
 * Base schema that all manifest types must extend
 * Note: Account context (accountId, region, environment) is handled
 * per manifest type in their respective sections (e.g., management, environments)
 */
export const ManifestBaseSchema = ManifestCoreSchema;

export type ManifestCore = z.infer<typeof ManifestCoreSchema>;
export type ManifestContext = z.infer<typeof ManifestContextSchema>;
export type ManifestBase = z.infer<typeof ManifestBaseSchema>;
