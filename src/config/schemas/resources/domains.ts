import { z } from 'zod';

/**
 * Domain management configuration schemas for CodeIQLabs AWS projects
 *
 * Simplified schema for convention-over-configuration approach.
 * Subdomains are derived from saasApps, not enumerated in the manifest.
 *
 * Architecture:
 * - Management Account: Hosts Route53 zones, CloudFront distributions, and ACM certs (us-east-1)
 * - Workload Accounts: Host application infrastructure (ALBs, ECS, etc.)
 * - CloudFront uses VPC Origins for private ALB connectivity
 *
 * Derived Subdomains (from saasApps):
 * - Marketing brands: {domain} (apex), www.{domain} → S3 Origin
 * - App brands: app.{domain}, {env}-app.{domain} → VPC Origin
 * - API brands: api.{domain}, {env}-api.{domain} → VPC Origin (if hasApi)
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
 * Registered domain configuration
 *
 * Defines a root domain hosted in the management account with optional delegation role.
 * Hosted zone ID is optional for importing existing zones.
 * All subdomains are derived from saasApps/saasEdge configuration.
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
   * Whether to create a cross-account delegation role for this domain
   * When true, creates an IAM role that allows workload accounts to create NS records
   * for subdomain delegation (e.g., nprd.savvue.com)
   * @default false
   */
  createDelegationRole: z.boolean().optional(),

  /**
   * Environments that are allowed to assume the delegation role
   * Only used when createDelegationRole is true
   * References keys from the environments section (e.g., ["nprd", "prod"])
   */
  allowedEnvironments: z.array(z.string()).optional(),
});

/**
 * Complete domain management configuration
 *
 * Consolidates all domain-related configuration:
 * - Registered domains with optional delegation roles
 * - WAF IP restrictions for NPRD environments
 *
 * Presence of this section implies domain management is enabled.
 * No 'enabled' flag needed - convention over configuration.
 */
export const DomainManagementSchema = z.object({
  /**
   * IP CIDRs allowed to access NPRD CloudFront distributions via WAF
   * This applies to ALL NPRD distributions across all brands (savvue, timisly, etc.)
   * Used to restrict access to development/staging environments
   * @example ["142.186.22.174/32"]
   */
  nprdAllowedCidrsWaf: z.array(z.string()).optional(),

  /**
   * List of registered domains to manage
   * Each domain can optionally have a cross-account delegation role
   * Subdomains are derived from saasApps/saasEdge, not enumerated here
   */
  registeredDomains: z.array(RegisteredDomainSchema).optional(),
});

/**
 * Type exports for TypeScript usage
 */
export type HostedZoneId = z.infer<typeof HostedZoneIdSchema>;
export type DomainName = z.infer<typeof DomainNameSchema>;
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
