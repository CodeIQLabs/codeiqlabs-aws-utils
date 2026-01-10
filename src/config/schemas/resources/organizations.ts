import { z } from 'zod';
import { ConfigModeSchema, KeySchema, NameSchema } from '../base';
import { AccountConfigSchema } from './accounts';

/**
 * AWS Organizations-specific schema components for CodeIQLabs configuration files
 *
 * This module provides validation schemas for AWS Organizations resources
 * including organizational units, accounts, and organization configuration.
 */

/**
 * Organizational Unit ID validation
 * AWS OU IDs follow the pattern: ou-{root_id}-{random_string}
 * where root_id is 4+ chars and random_string is 8+ chars
 */
export const OrganizationalUnitIdSchema = z
  .string()
  .regex(
    /^ou-[a-z0-9]{4,32}-[a-z0-9]{8,32}$/,
    'Invalid Organizational Unit ID format (expected: ou-xxxx-xxxxxxxx)',
  );

/**
 * Organization root ID validation
 */
export const OrganizationRootIdSchema = z
  .string()
  .regex(/^r-[a-z0-9]{4,32}$/, 'Invalid Organization root ID format (expected: r-xxxx)');

/**
 * Service Control Policy (SCP) ID validation
 */
export const ServiceControlPolicyIdSchema = z
  .string()
  .regex(/^p-[a-z0-9]{8,128}$/, 'Invalid Service Control Policy ID format (expected: p-xxxxxxxx)');

/**
 * Organizational Unit configuration schema
 */
export const OrganizationalUnitSchema = z.object({
  key: KeySchema,
  name: NameSchema,
  accounts: z.array(AccountConfigSchema),
  ouId: OrganizationalUnitIdSchema.optional(), // Required when organization.mode=adopt
  parentOuId: OrganizationalUnitIdSchema.optional(), // For nested OUs
  description: z.string().optional(),
  tags: z.record(z.string()).optional(),
});

/**
 * Service Control Policy configuration schema
 */
export const ServiceControlPolicySchema = z.object({
  name: NameSchema,
  description: z.string().optional(),
  policyDocument: z.union([
    z.string(), // JSON string
    z.record(z.any()), // Policy document object
  ]),
  targetType: z.enum(['ROOT', 'OU', 'ACCOUNT']),
  targetIds: z.array(z.string()), // Can be root IDs, OU IDs, or account IDs
  tags: z.record(z.string()).optional(),
});

/**
 * AWS Organizations feature set
 */
export const FeatureSetSchema = z.enum(['ALL', 'CONSOLIDATED_BILLING']);

/**
 * Organization configuration schema
 * Presence implies enabled - no 'enabled' flag needed
 */
export const OrganizationSchema = z.object({
  rootId: OrganizationRootIdSchema,
  mode: ConfigModeSchema,
  featureSet: FeatureSetSchema.optional().default('ALL'),
  organizationalUnits: z.array(OrganizationalUnitSchema),
  serviceControlPolicies: z.array(ServiceControlPolicySchema).optional(),
  enabledPolicyTypes: z
    .array(
      z.enum([
        'SERVICE_CONTROL_POLICY',
        'TAG_POLICY',
        'BACKUP_POLICY',
        'AISERVICES_OPT_OUT_POLICY',
      ]),
    )
    .optional()
    .default(['SERVICE_CONTROL_POLICY']),
  tags: z.record(z.string()).optional(),
});

// Export types for TypeScript usage
export type OrganizationalUnitId = z.infer<typeof OrganizationalUnitIdSchema>;
export type OrganizationRootId = z.infer<typeof OrganizationRootIdSchema>;
export type ServiceControlPolicyId = z.infer<typeof ServiceControlPolicyIdSchema>;
export type OrganizationalUnitConfig = z.infer<typeof OrganizationalUnitSchema>;
export type ServiceControlPolicyConfig = z.infer<typeof ServiceControlPolicySchema>;
export type FeatureSet = z.infer<typeof FeatureSetSchema>;
export type OrganizationConfig = z.infer<typeof OrganizationSchema>;
