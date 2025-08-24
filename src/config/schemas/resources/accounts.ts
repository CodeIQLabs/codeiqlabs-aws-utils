import { z } from 'zod';
import {
  AwsAccountIdSchema,
  EnvironmentSchema,
  KeySchema,
  NameSchema,
  EmailSchema,
  DescriptionSchema,
  TagsSchema,
  AwsRegionSchema,
} from '../base';

/**
 * AWS account and management configuration schemas for CodeIQLabs projects
 *
 * This module provides validation schemas for AWS account configurations,
 * management account settings, and related AWS resource configurations.
 */

/**
 * Basic AWS account configuration
 */
export const AccountConfigSchema = z.object({
  key: KeySchema,
  name: NameSchema,
  email: EmailSchema,
  environment: EnvironmentSchema,
  purpose: DescriptionSchema,
  tags: TagsSchema,
  accountId: AwsAccountIdSchema.optional(), // Required when organization.mode=adopt
});

/**
 * Management account configuration
 */
export const ManagementConfigSchema = z.object({
  accountId: AwsAccountIdSchema,
  region: AwsRegionSchema,
  environment: EnvironmentSchema,
});

/**
 * AWS managed policy ARN validation
 */
export const ManagedPolicyArnSchema = z
  .string()
  .regex(
    /^arn:aws:iam::(aws|\d{12}):policy\/[a-zA-Z0-9+=,.@_/-]+$/,
    'Invalid AWS managed policy ARN format',
  );

/**
 * AWS service principal validation
 */
export const ServicePrincipalSchema = z
  .string()
  .regex(
    /^[a-zA-Z0-9.-]+\.amazonaws\.com$/,
    'Invalid AWS service principal format (expected: service.amazonaws.com)',
  );

/**
 * AWS ARN validation (generic)
 */
export const ArnSchema = z
  .string()
  .regex(
    /^arn:aws:[a-zA-Z0-9-]+:[a-zA-Z0-9-]*:\d{0,12}:[a-zA-Z0-9-_/:.]+$/,
    'Invalid AWS ARN format',
  );

// Export types for TypeScript usage
export type AccountConfig = z.infer<typeof AccountConfigSchema>;
export type ManagementConfig = z.infer<typeof ManagementConfigSchema>;
export type ManagedPolicyArn = z.infer<typeof ManagedPolicyArnSchema>;
export type ServicePrincipal = z.infer<typeof ServicePrincipalSchema>;
export type Arn = z.infer<typeof ArnSchema>;
