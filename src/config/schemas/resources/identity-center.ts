import { z } from 'zod';
import {
  BooleanSchema,
  NameSchema,
  DescriptionSchema,
  TagsSchema,
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
 */
export const SSOAssignmentConfigSchema = z.object({
  principalType: z.enum(['USER', 'GROUP']),
  principalId: PrincipalIdSchema,
  permissionSetName: NameSchema, // References permission set by name
  targetType: z.literal('AWS_ACCOUNT'),
  targetKey: KeySchema, // Account key (resolved to account ID later)
  targetAccountId: AwsAccountIdSchema.optional(), // Direct account ID
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
  identitySource: IdentitySourceSchema.optional(),
  permissionSets: z.array(PermissionSetConfigSchema),
  assignments: z.array(SSOAssignmentConfigSchema),
  applications: z.array(ApplicationConfigSchema).optional(),
  trustedTokenIssuers: z.array(TrustedTokenIssuerSchema).optional(),
  tags: TagsSchema,
});

/**
 * Account assignment request schema
 */
export const AccountAssignmentRequestSchema = z.object({
  instanceArn: IdentityCenterInstanceArnSchema,
  permissionSetArn: PermissionSetArnSchema,
  principalType: z.enum(['USER', 'GROUP']),
  principalId: PrincipalIdSchema,
  targetType: z.literal('AWS_ACCOUNT'),
  targetId: AwsAccountIdSchema,
});

// Export types for TypeScript usage
export type IdentityCenterInstanceArn = z.infer<typeof IdentityCenterInstanceArnSchema>;
export type PermissionSetArn = z.infer<typeof PermissionSetArnSchema>;
export type PrincipalId = z.infer<typeof PrincipalIdSchema>;
export type PermissionSetConfig = z.infer<typeof PermissionSetConfigSchema>;
export type SSOAssignmentConfig = z.infer<typeof SSOAssignmentConfigSchema>;
export type IdentitySource = z.infer<typeof IdentitySourceSchema>;
export type ApplicationConfig = z.infer<typeof ApplicationConfigSchema>;
export type TrustedTokenIssuer = z.infer<typeof TrustedTokenIssuerSchema>;
export type IdentityCenterConfig = z.infer<typeof IdentityCenterSchema>;
export type AccountAssignmentRequest = z.infer<typeof AccountAssignmentRequestSchema>;
