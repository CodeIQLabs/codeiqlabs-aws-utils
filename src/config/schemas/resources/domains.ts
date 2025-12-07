import { z } from 'zod';
import {
  BooleanSchema,
  DescriptionSchema,
  TagsSchema,
  AwsAccountIdSchema,
  EnvironmentSchema,
  AwsRegionSchema,
} from '../base';

/**
 * Domain management configuration schemas for CodeIQLabs AWS projects
 *
 * This module provides validation schemas for centralized multi-account domain management,
 * including Route53 hosted zones, CloudFront distributions, ACM certificates, DNS records,
 * and cross-account delegation.
 *
 * Architecture:
 * - Management Account: Hosts Route53 zones, CloudFront distributions, and ACM certs (us-east-1)
 * - Workload Accounts: Host application infrastructure (ALBs, ECS, etc.)
 * - DNS Records: ALIAS records in Management account point to CloudFront/ALB endpoints
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
 * Subdomain type classification
 */
export const SubdomainTypeSchema = z.enum([
  'marketing', // Marketing/landing pages (e.g., www.example.com)
  'app', // Application frontend (e.g., app.example.com)
  'api', // API endpoints (e.g., api.example.com)
  'custom', // Custom subdomain type
]);

/**
 * CloudFront origin type
 */
export const CloudFrontOriginTypeSchema = z.enum([
  's3', // S3 bucket origin
  'alb', // Application Load Balancer origin
  'custom', // Custom origin (HTTP/HTTPS endpoint)
]);

/**
 * WAF configuration for a CloudFront distribution
 *
 * Small, functional block used to select a WAF profile (prod vs nprd)
 * and, for restricted profiles, provide an allowlist of IP CIDR ranges.
 */
export const WafConfigSchema = z.object({
  /**
   * WAF profile to apply to this distribution
   * - "prod": open to the internet (can include managed rules)
   * - "nprd": IP-restricted using allowedIpCidrs
   */
  profile: z.enum(['prod', 'nprd']).default('prod'),

  /**
   * Optional list of allowed IP CIDR ranges (only meaningful for restricted profiles like "nprd")
   */
  allowedIpCidrs: z.array(z.string()).optional(),
});

/**
 * CloudFront distribution configuration for a subdomain
 */
export const CloudFrontConfigSchema = z.object({
  /**
   * Whether CloudFront is enabled for this subdomain
   */
  enabled: BooleanSchema.default(false),

  /**
   * Origin type for the CloudFront distribution
   */
  originType: CloudFrontOriginTypeSchema.optional(),

  /**
   * Whether to enable AWS WAF for this distribution
   */
  wafEnabled: BooleanSchema.default(false),

  /**
   * WAF configuration block used to select WAF profile and optional IP allowlist
   */
  wafConfig: WafConfigSchema.optional(),

  /**
   * Price class for CloudFront distribution
   */
  priceClass: z
    .enum(['PriceClass_100', 'PriceClass_200', 'PriceClass_All'])
    .default('PriceClass_100'),

  /**
   * Additional CloudFront configuration
   */
  tags: TagsSchema.optional(),
});

/**
 * Application Load Balancer configuration for direct DNS (no CloudFront)
 */
export const AlbConfigSchema = z.object({
  /**
   * AWS account ID where the ALB is deployed
   */
  account: AwsAccountIdSchema,

  /**
   * AWS region where the ALB is deployed
   */
  region: AwsRegionSchema,

  /**
   * ALB name or identifier for lookup
   */
  name: z.string().min(1).optional(),

  /**
   * Whether to enable WAF for the ALB
   */
  wafEnabled: BooleanSchema.default(false),
});

/**
 * Subdomain configuration with CloudFront and DNS settings
 */
export const SubdomainConfigSchema = z.object({
  /**
   * Fully qualified subdomain name (e.g., "app.example.com", "www.example.com")
   */
  name: DomainNameSchema,

  /**
   * Subdomain type classification
   */
  type: SubdomainTypeSchema,

  /**
   * CloudFront distribution configuration
   */
  cloudfront: CloudFrontConfigSchema.optional(),

  /**
   * Direct ALB configuration (when CloudFront is not used)
   */
  alb: AlbConfigSchema.optional(),

  /**
   * Whether this subdomain is enabled
   */
  enabled: BooleanSchema.default(true),

  /**
   * Additional tags for subdomain resources
   */
  tags: TagsSchema.optional(),
});

/**
 * Cross-account domain delegation configuration (for NS record delegation)
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
   * Optional - if not provided, a new hosted zone will be created
   */
  hostedZoneId: HostedZoneIdSchema.optional(),

  /**
   * Domain registrar
   */
  registrar: DomainRegistrarSchema.default('route53'),

  /**
   * Whether to enable automatic renewal
   */
  autoRenew: BooleanSchema.default(true),

  /**
   * Subdomain configurations with CloudFront and DNS settings
   */
  subdomains: z.array(SubdomainConfigSchema).optional(),

  /**
   * Cross-account subdomain delegations (NS record delegation)
   */
  delegations: z.array(DomainDelegationSchema).optional(),

  /**
   * SSL certificates to manage for this domain
   * Note: Certificates for CloudFront must be in us-east-1
   * Certificates for ALB must be in the same region as the ALB
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
export type SubdomainType = z.infer<typeof SubdomainTypeSchema>;
export type CloudFrontOriginType = z.infer<typeof CloudFrontOriginTypeSchema>;
export type WafConfig = z.infer<typeof WafConfigSchema>;
export type CloudFrontConfig = z.infer<typeof CloudFrontConfigSchema>;
export type AlbConfig = z.infer<typeof AlbConfigSchema>;
export type SubdomainConfig = z.infer<typeof SubdomainConfigSchema>;
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
