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
 * AWS IAM policy document schema (simplified)
 */
export const PolicyDocumentSchema = z.object({
  Version: z.string().default('2012-10-17'),
  Statement: z.array(
    z.object({
      Effect: z.enum(['Allow', 'Deny']),
      Action: z.union([z.string(), z.array(z.string())]),
      Resource: z.union([z.string(), z.array(z.string())]).optional(),
      Principal: z
        .union([
          z.string(),
          z.object({
            AWS: z.union([z.string(), z.array(z.string())]).optional(),
            Service: z.union([z.string(), z.array(z.string())]).optional(),
            Federated: z.union([z.string(), z.array(z.string())]).optional(),
          }),
        ])
        .optional(),
      Condition: z.record(z.record(z.union([z.string(), z.array(z.string())]))).optional(),
    }),
  ),
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

/**
 * S3 bucket name validation
 */
export const S3BucketNameSchema = z
  .string()
  .regex(/^[a-z0-9][a-z0-9.-]*[a-z0-9]$/, 'Invalid S3 bucket name format')
  .min(3, 'S3 bucket name must be at least 3 characters')
  .max(63, 'S3 bucket name must be at most 63 characters');

/**
 * CloudFormation stack name validation
 */
export const StackNameSchema = z
  .string()
  .regex(
    /^[a-zA-Z][a-zA-Z0-9-]*$/,
    'Stack name must start with a letter and contain only alphanumeric characters and hyphens',
  )
  .min(1, 'Stack name cannot be empty')
  .max(128, 'Stack name must be at most 128 characters');

/**
 * IAM role name validation
 */
export const IamRoleNameSchema = z
  .string()
  .regex(
    /^[a-zA-Z0-9+=,.@_-]+$/,
    'IAM role name can only contain alphanumeric characters and +=,.@_-',
  )
  .min(1, 'IAM role name cannot be empty')
  .max(64, 'IAM role name must be at most 64 characters');

/**
 * Route53 hosted zone ID validation
 */
export const HostedZoneIdSchema = z
  .string()
  .regex(/^Z[A-Z0-9]+$/, 'Invalid Route53 hosted zone ID format');

/**
 * Domain name validation
 */
export const DomainNameSchema = z
  .string()
  .regex(/^[a-zA-Z0-9][a-zA-Z0-9.-]*[a-zA-Z0-9]$/, 'Invalid domain name format')
  .min(1, 'Domain name cannot be empty')
  .max(253, 'Domain name must be at most 253 characters');

/**
 * AWS resource tag key validation
 */
export const TagKeySchema = z
  .string()
  .regex(/^[a-zA-Z0-9\s_.:/=+@-]*$/, 'Invalid tag key format')
  .min(1, 'Tag key cannot be empty')
  .max(128, 'Tag key must be at most 128 characters');

/**
 * AWS resource tag value validation
 */
export const TagValueSchema = z
  .string()
  .regex(/^[a-zA-Z0-9\s_.:/=+@-]*$/, 'Invalid tag value format')
  .max(256, 'Tag value must be at most 256 characters');

/**
 * Enhanced tags schema with AWS-specific validation
 */
export const AwsTagsSchema = z.record(TagKeySchema, TagValueSchema).optional();

// Export types for TypeScript usage
export type AccountConfig = z.infer<typeof AccountConfigSchema>;
export type ManagementConfig = z.infer<typeof ManagementConfigSchema>;
export type PolicyDocument = z.infer<typeof PolicyDocumentSchema>;
export type ManagedPolicyArn = z.infer<typeof ManagedPolicyArnSchema>;
export type ServicePrincipal = z.infer<typeof ServicePrincipalSchema>;
export type Arn = z.infer<typeof ArnSchema>;
export type S3BucketName = z.infer<typeof S3BucketNameSchema>;
export type StackName = z.infer<typeof StackNameSchema>;
export type IamRoleName = z.infer<typeof IamRoleNameSchema>;
export type HostedZoneId = z.infer<typeof HostedZoneIdSchema>;
export type DomainName = z.infer<typeof DomainNameSchema>;
export type TagKey = z.infer<typeof TagKeySchema>;
export type TagValue = z.infer<typeof TagValueSchema>;
export type AwsTags = z.infer<typeof AwsTagsSchema>;
