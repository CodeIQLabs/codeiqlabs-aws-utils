import { z } from 'zod';
import {
  BooleanSchema,
  DescriptionSchema,
  TagsSchema,
  AwsAccountIdSchema,
  EnvironmentSchema,
} from '../base';

/**
 * Domain management configuration schemas for CodeIQLabs AWS projects
 *
 * This module provides validation schemas for centralized domain management,
 * DNS delegation, and SSL certificate configuration in the management account.
 * Supports Route53 hosted zones, cross-account delegation, and automated
 * certificate management.
 */

/**
 * Route53 hosted zone ID validation
 * AWS hosted zone IDs follow the pattern: Z{alphanumeric string}
 */
export const HostedZoneIdSchema = z
  .string()
  .regex(
    /^Z[A-Z0-9]{10,32}$/,
    'Invalid Route53 Hosted Zone ID format (expected: Z followed by 10-32 alphanumeric characters)',
  );

/**
 * Domain name validation
 * Supports standard domain formats including subdomains
 */
export const DomainNameSchema = z
  .string()
  .regex(
    /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/,
    'Invalid domain name format',
  )
  .min(1)
  .max(253);

/**
 * SSL certificate key algorithm options
 */
export const CertificateKeyAlgorithmSchema = z.enum([
  'RSA_1024',
  'RSA_2048',
  'RSA_3072',
  'RSA_4096',
  'EC_prime256v1',
  'EC_secp384r1',
  'EC_secp521r1',
]);

/**
 * SSL certificate validation method
 */
export const CertificateValidationMethodSchema = z.enum(['DNS', 'EMAIL']);

/**
 * Domain registrar options
 */
export const DomainRegistrarSchema = z.enum(['route53', 'external']);

/**
 * Cross-account domain delegation configuration
 */
export const DomainDelegationSchema = z.object({
  /**
   * Subdomain to delegate (e.g., "www", "staging", "api")
   */
  subdomain: z.string().min(1).max(63),

  /**
   * Target AWS account ID where the subdomain will be managed
   */
  targetAccount: AwsAccountIdSchema,

  /**
   * Target environment for the delegation
   */
  targetEnvironment: EnvironmentSchema,

  /**
   * Purpose or description of the delegation
   */
  purpose: DescriptionSchema,

  /**
   * Whether to create the delegation automatically
   */
  enabled: BooleanSchema.default(true),

  /**
   * Additional tags for the delegation records
   */
  tags: TagsSchema.optional(),
});

/**
 * SSL certificate configuration
 */
export const CertificateConfigSchema = z.object({
  /**
   * Domain names to include in the certificate
   * First domain is the primary, others are Subject Alternative Names (SANs)
   */
  domains: z.array(DomainNameSchema).min(1),

  /**
   * Certificate validation method
   */
  validationMethod: CertificateValidationMethodSchema.default('DNS'),

  /**
   * Key algorithm for the certificate
   */
  keyAlgorithm: CertificateKeyAlgorithmSchema.default('RSA_2048'),

  /**
   * Whether to enable automatic renewal
   */
  autoRenew: BooleanSchema.default(true),

  /**
   * Additional tags for the certificate
   */
  tags: TagsSchema.optional(),
});

/**
 * Registered domain configuration
 */
export const RegisteredDomainSchema = z.object({
  /**
   * Domain name (e.g., "codeiqlabs.com")
   */
  name: DomainNameSchema,

  /**
   * Route53 hosted zone ID for the domain
   */
  hostedZoneId: HostedZoneIdSchema,

  /**
   * Domain registrar
   */
  registrar: DomainRegistrarSchema.default('route53'),

  /**
   * Whether to enable automatic renewal
   */
  autoRenew: BooleanSchema.default(true),

  /**
   * Cross-account subdomain delegations
   */
  delegations: z.array(DomainDelegationSchema).optional(),

  /**
   * SSL certificates to manage for this domain
   */
  certificates: z.array(CertificateConfigSchema).optional(),

  /**
   * Additional tags for domain resources
   */
  tags: TagsSchema.optional(),
});

/**
 * Complete domain management configuration
 */
export const DomainManagementSchema = z.object({
  /**
   * Whether domain management is enabled
   */
  enabled: BooleanSchema.default(true),

  /**
   * List of registered domains to manage
   */
  registeredDomains: z.array(RegisteredDomainSchema).min(1),

  /**
   * Default tags to apply to all domain resources
   */
  defaultTags: TagsSchema.optional(),
});

/**
 * Type exports for TypeScript usage
 */
export type HostedZoneId = z.infer<typeof HostedZoneIdSchema>;
export type DomainName = z.infer<typeof DomainNameSchema>;
export type CertificateKeyAlgorithm = z.infer<typeof CertificateKeyAlgorithmSchema>;
export type CertificateValidationMethod = z.infer<typeof CertificateValidationMethodSchema>;
export type DomainRegistrar = z.infer<typeof DomainRegistrarSchema>;
export type DomainDelegation = z.infer<typeof DomainDelegationSchema>;
export type CertificateConfig = z.infer<typeof CertificateConfigSchema>;
export type RegisteredDomain = z.infer<typeof RegisteredDomainSchema>;
export type DomainManagement = z.infer<typeof DomainManagementSchema>;

/**
 * Validation functions
 */
export function validateDomainManagement(config: unknown): DomainManagement {
  return DomainManagementSchema.parse(config);
}

export function safeValidateDomainManagement(config: unknown) {
  return DomainManagementSchema.safeParse(config);
}
