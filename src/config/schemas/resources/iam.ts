import { z } from 'zod';
import { AwsAccountIdSchema, ISO8601DurationSchema } from '../base';

/**
 * IAM configuration schemas for CodeIQLabs AWS projects
 *
 * This module provides validation schemas for AWS Identity and Access Management
 * resources including cross-account roles, policies, and access configurations.
 */

/**
 * Cross-account role configuration
 * Defines roles that can be assumed across AWS accounts
 */
export const CrossAccountRoleSchema = z.object({
  roleName: z.string().min(1, 'Role name is required'),
  trustedAccountId: AwsAccountIdSchema,
  sessionDuration: ISO8601DurationSchema.optional(),
  externalId: z.string().optional(),
});

export type CrossAccountRole = z.infer<typeof CrossAccountRoleSchema>;
