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
 * Management account reference schema
 * Used consistently across all manifest types to reference the management account
 */
export const ManagementRefSchema = z.object({
  accountId: AwsAccountIdSchema,
  region: AwsRegionSchema,
  environment: z.literal('mgmt'),
});

/**
 * Base schema that all manifest types must extend
 * Includes the core fields (project, company) and management reference
 */
export const ManifestBaseSchema = ManifestCoreSchema.merge(
  z.object({
    management: ManagementRefSchema,
  }),
);

export type ManifestCore = z.infer<typeof ManifestCoreSchema>;
export type ManifestContext = z.infer<typeof ManifestContextSchema>;
export type ManagementRef = z.infer<typeof ManagementRefSchema>;
export type ManifestBase = z.infer<typeof ManifestBaseSchema>;
