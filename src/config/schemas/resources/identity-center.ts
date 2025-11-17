import { z } from 'zod';
import {
  BooleanSchema,
  NameSchema,
  DescriptionSchema,
  TagsSchema,
  RequiredTagsSchema,
  ISO8601DurationSchema,
  KeySchema,
  AwsAccountIdSchema,
} from '../base';
import { ArnSchema, ManagedPolicyArnSchema } from './accounts';

/**
 * AWS Identity Center (SSO) schema components for CodeIQLabs configuration files
 *
 * This module provides validation schemas for AWS Identity Center resources
 * including permission sets, assignments, and identity center configuration.
 */

/**
 * Identity Center instance ARN validation
 */
export const IdentityCenterInstanceArnSchema = z
  .string()
  .regex(
    /^arn:aws:sso:::instance\/ssoins-[a-z0-9]{16}$/,
    'Invalid Identity Center instance ARN format',
  );

/**
 * Permission Set ARN validation
 */
export const PermissionSetArnSchema = z
  .string()
  .regex(
    /^arn:aws:sso:::permissionSet\/ssoins-[a-z0-9]{16}\/ps-[a-z0-9]{16}$/,
    'Invalid Permission Set ARN format',
  );

/**
 * Identity Center user/group ID validation
 */
export const PrincipalIdSchema = z
  .string()
  .regex(
    /^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/,
    'Invalid Identity Center principal ID format (expected UUID)',
  );

/**
 * Identity Store ID validation
 */
export const IdentityStoreIdSchema = z
  .string()
  .regex(/^d-[a-z0-9]{10}$/, 'Invalid Identity Store ID format (expected d-xxxxxxxxxx)');

/**
 * Identity Center User configuration schema
 *
 * Note: AWS CloudFormation does not support creating Identity Center users.
 * This schema is used for mapping user keys to existing user IDs for assignments.
 * Users must be created manually in AWS Identity Center first.
 *
 * Fields:
 * - key: Internal reference key used in assignments (e.g., principalKey: "alif")
 * - userId: The actual AWS Identity Center User ID (must be obtained from AWS)
 * - userName: Optional - for documentation/readability only
 */
export const UserConfigSchema = z.object({
  key: KeySchema, // Internal reference key for assignments
  userId: PrincipalIdSchema, // Existing user ID from Identity Center (required)
  userName: z.string().min(1).max(128).optional(), // Username for documentation/readability only
});

/**
 * Permission Set configuration schema
 */
export const PermissionSetConfigSchema = z.object({
  name: NameSchema,
  description: DescriptionSchema,
  sessionDuration: ISO8601DurationSchema.optional(), // ISO 8601 duration format (PT1H, PT8H, etc.)
  managedPolicies: z.array(ManagedPolicyArnSchema).optional(),
  inlinePolicy: z
    .union([
      z.string(), // JSON string
      z.record(z.any()), // Policy document object
    ])
    .transform((val) => {
      // Normalize to object format for consistent handling
      if (typeof val === 'string') {
        try {
          return JSON.parse(val);
        } catch (error) {
          throw new Error(
            `Invalid JSON in inlinePolicy: ${error instanceof Error ? error.message : 'Unknown error'}`,
          );
        }
      }
      return val;
    })
    .optional(),
  customerManagedPolicies: z
    .array(
      z.object({
        name: NameSchema,
        path: z.string().optional().default('/'),
      }),
    )
    .optional(),
  permissionsBoundary: z
    .object({
      managedPolicyArn: ManagedPolicyArnSchema.optional(),
      customerManagedPolicy: z
        .object({
          name: NameSchema,
          path: z.string().optional().default('/'),
        })
        .optional(),
    })
    .optional(),
  tags: TagsSchema,
});

/**
 * SSO Assignment configuration schema
 *
 * Supports two modes for target accounts:
 * 1. Single target: Use `targetKey` for one account
 * 2. Multiple targets: Use `targetKeys` for multiple accounts (flattened syntax)
 */
export const SSOAssignmentConfigSchema = z
  .object({
    principalType: z.enum(['USER', 'GROUP']),
    principalId: PrincipalIdSchema.optional(), // Optional: can use principalKey instead
    principalKey: KeySchema.optional(), // Optional: references user/group by key
    permissionSetName: NameSchema, // References permission set by name
    targetType: z.literal('AWS_ACCOUNT'),
    targetKey: KeySchema.optional(), // Single account key (use this OR targetKeys)
    targetKeys: z.array(KeySchema).optional(), // Multiple account keys (use this OR targetKey)
    targetAccountId: AwsAccountIdSchema.optional(), // Direct account ID (only with targetKey)
  })
  .refine((data) => data.principalId || data.principalKey, {
    message: 'Either principalId or principalKey must be provided',
    path: ['principalId', 'principalKey'],
  })
  .refine((data) => data.targetKey || data.targetKeys, {
    message: 'Either targetKey or targetKeys must be provided',
    path: ['targetKey', 'targetKeys'],
  })
  .refine((data) => !(data.targetKey && data.targetKeys), {
    message: 'Cannot specify both targetKey and targetKeys - use one or the other',
    path: ['targetKey', 'targetKeys'],
  });

/**
 * Identity Source configuration
 */
export const IdentitySourceSchema = z.object({
  type: z.enum(['INTERNAL', 'EXTERNAL']),
  externalProvider: z
    .object({
      samlMetadataDocument: z.string().optional(),
      samlMetadataUrl: z.string().url().optional(),
      attributeMapping: z.record(z.string()).optional(),
    })
    .optional(),
});

/**
 * Application configuration for Identity Center
 */
export const ApplicationConfigSchema = z.object({
  name: NameSchema,
  description: DescriptionSchema.optional(),
  applicationProviderArn: ArnSchema,
  instanceArn: IdentityCenterInstanceArnSchema,
  status: z.enum(['ENABLED', 'DISABLED']).optional().default('ENABLED'),
  portalOptions: z
    .object({
      visibility: z.enum(['ENABLED', 'DISABLED']).optional().default('ENABLED'),
      signInOptions: z
        .object({
          origin: z.enum(['IDENTITY_CENTER', 'APPLICATION']).optional().default('IDENTITY_CENTER'),
          applicationUrl: z.string().url().optional(),
        })
        .optional(),
    })
    .optional(),
  tags: TagsSchema,
});

/**
 * Trusted Token Issuer configuration
 */
export const TrustedTokenIssuerSchema = z.object({
  name: NameSchema,
  issuerUrl: z.string().url(),
  clientToken: z.string().optional(),
  trustedTokenIssuerType: z.enum(['OIDC_JWT']),
  trustedTokenIssuerConfiguration: z.object({
    issuerUrl: z.string().url(),
    audienceList: z.array(z.string()),
    jwksRetrievalOption: z.enum(['OPEN_ID_DISCOVERY']).optional().default('OPEN_ID_DISCOVERY'),
  }),
  tags: TagsSchema,
});

/**
 * Main Identity Center configuration schema
 */
export const IdentityCenterSchema = z.object({
  enabled: BooleanSchema,
  instanceArn: IdentityCenterInstanceArnSchema,
  identityStoreId: IdentityStoreIdSchema.optional(), // Required for user creation
  identitySource: IdentitySourceSchema.optional(),
  users: z.array(UserConfigSchema).optional(), // Users to create
  permissionSets: z.array(PermissionSetConfigSchema),
  assignments: z.array(SSOAssignmentConfigSchema),
  applications: z.array(ApplicationConfigSchema).optional(),
  trustedTokenIssuers: z.array(TrustedTokenIssuerSchema).optional(),
  tags: RequiredTagsSchema, // Owner and ManagedBy are required
});

// Export types for TypeScript usage
export type IdentityCenterInstanceArn = z.infer<typeof IdentityCenterInstanceArnSchema>;
export type IdentityStoreId = z.infer<typeof IdentityStoreIdSchema>;
export type PermissionSetArn = z.infer<typeof PermissionSetArnSchema>;
export type PrincipalId = z.infer<typeof PrincipalIdSchema>;
export type UserConfig = z.infer<typeof UserConfigSchema>;
export type PermissionSetConfig = z.infer<typeof PermissionSetConfigSchema>;
export type SSOAssignmentConfig = z.infer<typeof SSOAssignmentConfigSchema>;
export type IdentitySource = z.infer<typeof IdentitySourceSchema>;
export type ApplicationConfig = z.infer<typeof ApplicationConfigSchema>;
export type TrustedTokenIssuer = z.infer<typeof TrustedTokenIssuerSchema>;
export type IdentityCenterConfig = z.infer<typeof IdentityCenterSchema>;
