import { z } from 'zod';
import {
  BooleanSchema,
  ConfigModeSchema,
  NameSchema,
  DescriptionSchema,
  TagsSchema,
} from '../base';
import { CidrBlockSchema } from './networking';

/**
 * Security configuration schemas for CodeIQLabs AWS projects
 *
 * This module provides validation schemas for AWS security resources
 * including security groups, NACLs, IAM roles, KMS keys, and security configurations.
 */

/**
 * Port range validation
 */
export const PortRangeSchema = z.union([
  z.number().int().min(0).max(65535), // Single port
  z.object({
    from: z.number().int().min(0).max(65535),
    to: z.number().int().min(0).max(65535),
  }), // Port range
]);

/**
 * Protocol validation for security group rules
 */
export const ProtocolSchema = z.union([
  z.enum(['tcp', 'udp', 'icmp', 'icmpv6']),
  z.number().int().min(-1).max(255), // Protocol number (-1 for all)
]);

/**
 * Security group rule source/destination
 */
export const SecurityGroupSourceSchema = z.union([
  z.object({
    type: z.literal('cidr'),
    cidr: CidrBlockSchema,
  }),
  z.object({
    type: z.literal('security-group'),
    securityGroupId: z
      .string()
      .regex(/^sg-[a-z0-9]+$/, 'Invalid Security Group ID')
      .optional(),
    securityGroupName: NameSchema.optional(),
  }),
  z.object({
    type: z.literal('prefix-list'),
    prefixListId: z.string().regex(/^pl-[a-z0-9]+$/, 'Invalid Prefix List ID'),
  }),
]);

/**
 * Security group rule configuration
 */
export const SecurityGroupRuleSchema = z.object({
  type: z.enum(['ingress', 'egress']),
  protocol: ProtocolSchema,
  port: PortRangeSchema.optional(),
  source: SecurityGroupSourceSchema,
  description: DescriptionSchema.optional(),
});

/**
 * Security group configuration
 */
export const SecurityGroupConfigSchema = z.object({
  name: NameSchema,
  description: DescriptionSchema,
  rules: z.array(SecurityGroupRuleSchema).optional(),
  tags: TagsSchema,
});

/**
 * Network ACL rule configuration
 */
export const NetworkAclRuleSchema = z.object({
  ruleNumber: z.number().int().min(1).max(32766),
  type: z.enum(['ingress', 'egress']),
  protocol: ProtocolSchema,
  port: PortRangeSchema.optional(),
  source: CidrBlockSchema,
  action: z.enum(['allow', 'deny']),
  description: DescriptionSchema.optional(),
});

/**
 * Network ACL configuration
 */
export const NetworkAclConfigSchema = z.object({
  name: NameSchema,
  rules: z.array(NetworkAclRuleSchema).optional(),
  subnetAssociations: z.array(NameSchema).optional(), // References subnet names
  tags: TagsSchema,
});

/**
 * IAM policy statement configuration
 */
export const IamPolicyStatementSchema = z.object({
  effect: z.enum(['Allow', 'Deny']),
  actions: z.union([z.string(), z.array(z.string())]),
  resources: z.union([z.string(), z.array(z.string())]).optional(),
  conditions: z.record(z.record(z.union([z.string(), z.array(z.string())]))).optional(),
  principals: z
    .object({
      AWS: z.union([z.string(), z.array(z.string())]).optional(),
      Service: z.union([z.string(), z.array(z.string())]).optional(),
      Federated: z.union([z.string(), z.array(z.string())]).optional(),
    })
    .optional(),
});

/**
 * IAM policy document configuration
 */
export const IamPolicyDocumentSchema = z.object({
  version: z.string().default('2012-10-17'),
  statements: z.array(IamPolicyStatementSchema),
});

/**
 * IAM role configuration
 */
export const IamRoleConfigSchema = z.object({
  name: NameSchema,
  description: DescriptionSchema.optional(),
  assumeRolePolicy: IamPolicyDocumentSchema,
  inlinePolicies: z.record(IamPolicyDocumentSchema).optional(),
  managedPolicyArns: z.array(z.string()).optional(),
  maxSessionDuration: z.number().int().min(3600).max(43200).optional(), // 1-12 hours
  path: z.string().default('/'),
  tags: TagsSchema,
});

/**
 * KMS key policy configuration
 */
export const KmsKeyPolicySchema = z.object({
  version: z.string().default('2012-10-17'),
  statements: z.array(IamPolicyStatementSchema),
});

/**
 * KMS key configuration
 */
export const KmsKeyConfigSchema = z.object({
  name: NameSchema,
  description: DescriptionSchema,
  keyUsage: z.enum(['ENCRYPT_DECRYPT', 'SIGN_VERIFY']).default('ENCRYPT_DECRYPT'),
  keySpec: z
    .enum([
      'SYMMETRIC_DEFAULT',
      'RSA_2048',
      'RSA_3072',
      'RSA_4096',
      'ECC_NIST_P256',
      'ECC_NIST_P384',
      'ECC_NIST_P521',
      'ECC_SECG_P256K1',
    ])
    .default('SYMMETRIC_DEFAULT'),
  policy: KmsKeyPolicySchema.optional(),
  enableKeyRotation: BooleanSchema.default(true),
  deletionWindowInDays: z.number().int().min(7).max(30).optional(),
  aliases: z.array(z.string()).optional(),
  tags: TagsSchema,
});

/**
 * Systems Manager Session Manager configuration
 */
export const SessionManagerConfigSchema = z.object({
  enabled: BooleanSchema.default(true),
  s3BucketName: NameSchema.optional(), // For session logging
  s3KeyPrefix: z.string().optional(),
  cloudWatchLogGroupName: NameSchema.optional(),
  cloudWatchEncryptionEnabled: BooleanSchema.default(true),
  idleSessionTimeout: z.number().int().min(1).max(60).default(20), // Minutes
  maxSessionDuration: z.number().int().min(1).max(60).default(60), // Minutes
  runAsEnabled: BooleanSchema.default(false),
  runAsDefaultUser: z.string().optional(),
});

/**
 * Complete security configuration schema
 */
export const SecurityConfigSchema = z.object({
  mode: ConfigModeSchema.default('create'),
  securityGroups: z.array(SecurityGroupConfigSchema).optional(),
  networkAcls: z.array(NetworkAclConfigSchema).optional(),
  iamRoles: z.array(IamRoleConfigSchema).optional(),
  kmsKeys: z.array(KmsKeyConfigSchema).optional(),
  sessionManager: SessionManagerConfigSchema.optional(),
});

// Export types for TypeScript usage
export type PortRange = z.infer<typeof PortRangeSchema>;
export type Protocol = z.infer<typeof ProtocolSchema>;
export type SecurityGroupSource = z.infer<typeof SecurityGroupSourceSchema>;
export type SecurityGroupRule = z.infer<typeof SecurityGroupRuleSchema>;
export type SecurityGroupConfig = z.infer<typeof SecurityGroupConfigSchema>;
export type NetworkAclRule = z.infer<typeof NetworkAclRuleSchema>;
export type NetworkAclConfig = z.infer<typeof NetworkAclConfigSchema>;
export type IamPolicyStatement = z.infer<typeof IamPolicyStatementSchema>;
export type IamPolicyDocument = z.infer<typeof IamPolicyDocumentSchema>;
export type IamRoleConfig = z.infer<typeof IamRoleConfigSchema>;
export type KmsKeyPolicy = z.infer<typeof KmsKeyPolicySchema>;
export type KmsKeyConfig = z.infer<typeof KmsKeyConfigSchema>;
export type SessionManagerConfig = z.infer<typeof SessionManagerConfigSchema>;
export type SecurityConfig = z.infer<typeof SecurityConfigSchema>;
