import { z } from 'zod';
import {
  ProjectNameSchema,
  CompanyNameSchema,
  DeploymentTargetSchema,
  AwsAccountIdSchema,
  AwsRegionSchema,
} from '../base';
import {
  OrganizationSchema,
  IdentityCenterSchema,
  DomainManagementSchema,
  GitHubDeployPermissionsSchema,
  GitHubOidcConfigSchema,
  EcsComputeConfigSchema,
  AuroraConfigSchema,
} from '../resources';

/**
 * Unified Application Configuration Schema for CodeIQLabs AWS Projects
 *
 * This schema uses convention-over-configuration: presence of a section implies
 * it is enabled. No 'enabled: true' flags are needed.
 *
 * Key principles:
 * - No manifestType field - components define what gets deployed
 * - Presence implies enabled - if a section exists, it's deployed
 * - Subdomains derived from saasApps - no enumeration needed
 * - Maximum flexibility - deploy any combination of components
 *
 * @example Management account deployment
 * ```yaml
 * naming:
 *   company: "CodeIQLabs"
 *   project: "Core"
 * environments:
 *   mgmt:
 *     accountId: "682475224767"
 *     region: us-east-1
 * organization:
 *   rootId: "r-xxxx"
 * identityCenter:
 *   instanceArn: "arn:aws:sso:::instance/ssoins-xxx"
 * ```
 *
 * @example Customization deployment (infrastructure + CDN)
 * ```yaml
 * naming:
 *   company: "CodeIQLabs"
 *   project: "Customization"
 * environments:
 *   mgmt:
 *     accountId: "682475224767"
 *     region: us-east-1
 *   nprd:
 *     accountId: "466279485605"
 *     region: us-east-1
 * saasApps:
 *   - name: savvue
 *     domain: savvue.com
 *     hasApi: true
 * infrastructure:
 *   targetEnvironments: [nprd, prod]
 * domains:
 *   registeredDomains:
 *     - name: savvue.com
 * ```
 */

// DeploymentTargetSchema is imported from '../base'

/**
 * Naming configuration schema
 * Defines company and project names used for stack and resource naming
 */
export const NamingConfigSchema = z.object({
  /**
   * Company name - used in stack names (e.g., CodeIQLabs)
   */
  company: CompanyNameSchema,

  /**
   * Project name - used in stack names (e.g., SaaS, Management, Customization)
   */
  project: ProjectNameSchema,

  /**
   * Owner name - used for the Owner tag on resources
   * Represents the team or individual responsible for the resources.
   * If not specified, defaults to the company name.
   * @example "Platform Team", "DevOps", "John Smith"
   */
  owner: z.string().min(1).optional(),

  /**
   * Skip environment name in stack names.
   * When true, stack names omit the environment segment.
   *
   * With skipEnvironmentName=false (default): {Company}-{Project}-{Environment}-{Component}-Stack
   *   Example: CodeIQLabs-SaaS-NonProd-VPC-Stack
   *
   * With skipEnvironmentName=true: {Company}-{Project}-{Component}-Stack
   *   Example: CodeIQLabs-Management-Organizations-Stack
   *
   * Use for repos that only deploy to one account (e.g., management-aws).
   */
  skipEnvironmentName: z.boolean().optional(),
});

/**
 * Environment-specific configuration for multi-environment deployments
 */
export const EnvironmentConfigSchema = z.object({
  /**
   * AWS account ID for this environment
   */
  accountId: AwsAccountIdSchema,

  /**
   * AWS region for this environment
   */
  region: AwsRegionSchema,

  /**
   * Optional environment-specific configuration
   */
  config: z.record(z.unknown()).optional(),
});

/**
 * SaaS Application configuration schema (LEGACY - use saasEdge/saasWorkload instead)
 *
 * Defines a brand/application in the SaaS platform.
 * Infrastructure is derived from these flags - no explicit component configuration needed.
 */
export const SaasAppSchema = z.object({
  /**
   * Brand/application name (e.g., "savvue", "equitrio")
   * Used for resource naming: api-{name}, db-{name}, etc.
   */
  name: z.string().min(1),

  /**
   * Domain name for this brand (e.g., "savvue.com")
   */
  domain: z.string().min(1),

  /**
   * If true, this brand only has a marketing site (S3 bucket only)
   * No webapp, API, or database infrastructure is created
   * @default false
   */
  marketingOnly: z.boolean().optional(),

  /**
   * If true, creates a dedicated API service (api-{name}) for this brand
   * The API receives DATABASE_URL_CORE and DATABASE_URL_{BRAND} environment variables
   * @default false
   */
  hasApi: z.boolean().optional(),

  /**
   * If true, creates a webapp ECS service for this brand
   * When not specified, webapp is created for all non-marketingOnly brands
   * @default true (unless marketingOnly is true)
   */
  hasWebapp: z.boolean().optional(),
});

export type SaasApp = z.infer<typeof SaasAppSchema>;

/**
 * Distribution type for saasEdge configuration
 * Defines what type of CloudFront distribution to create
 */
export const DistributionTypeSchema = z.enum(['marketing', 'webapp', 'api']);
export type DistributionType = z.infer<typeof DistributionTypeSchema>;

/**
 * Origin type for saasEdge distributions
 * Defines what backend the CloudFront distribution routes to
 * - alb: Routes to ALB (ECS Fargate containers)
 * - apiGateway: Routes to API Gateway (Lambda functions)
 * - s3: Routes to S3 bucket (static files for SPAs)
 */
export const OriginTypeSchema = z.enum(['alb', 'apiGateway', 's3']);
export type OriginType = z.infer<typeof OriginTypeSchema>;

/**
 * Service type for saasWorkload configuration
 * Defines what type of ECS service to create
 */
export const ServiceTypeSchema = z.enum(['webapp', 'api']);
export type ServiceType = z.infer<typeof ServiceTypeSchema>;

/**
 * SaaS Edge Distribution Configuration
 * Defines a single CloudFront distribution
 */
export const SaasEdgeDistributionSchema = z.object({
  /**
   * Distribution type
   * - marketing: Creates {domain} → CloudFront → S3 (static site)
   * - webapp: Creates app.{domain} → CloudFront → ALB or S3
   * - api: Creates api.{domain} → CloudFront → ALB or API Gateway
   */
  type: DistributionTypeSchema,

  /**
   * Origin type for webapp and API distributions
   * - alb: Routes to ALB (ECS Fargate containers) - default for webapp
   * - apiGateway: Routes to API Gateway (Lambda functions) - for api type only
   * - s3: Routes to S3 bucket (static files) - for static webapps (SPAs)
   *
   * For 'marketing' type, origin is always S3 (originType is ignored).
   * For 'webapp' type, defaults to 'alb' if not specified. Use 's3' for static SPAs.
   * For 'api' type, defaults to 'alb' if not specified.
   * @default 'alb'
   */
  originType: OriginTypeSchema.optional(),
});

export type SaasEdgeDistribution = z.infer<typeof SaasEdgeDistributionSchema>;

/**
 * SaaS Edge Configuration (customization-aws)
 * Defines CloudFront distributions, S3 buckets, Route53 zones, and ACM certificates
 * All resources created in management account
 */
export const SaasEdgeAppSchema = z.object({
  /**
   * Domain name for this brand (e.g., "savvue.com")
   */
  domain: z.string().min(1),

  /**
   * CloudFront distributions to create for this domain
   * - marketing: Creates {domain} → CloudFront → S3 (static site)
   * - webapp: Creates app.{domain} → CloudFront → ALB
   * - api: Creates api.{domain} → CloudFront → ALB or API Gateway (based on originType)
   */
  distributions: z.array(SaasEdgeDistributionSchema),
});

export type SaasEdgeApp = z.infer<typeof SaasEdgeAppSchema>;

/**
 * SaaS Workload Configuration (saas-aws)
 * Defines ECS services, Lambda APIs, S3 buckets, Aurora databases, Secrets, and Origin Zones
 * All resources created in workload accounts (nprd/prod)
 *
 * Convention-over-Configuration:
 * - webapp: true → ECS Fargate service (serves React/Expo web app)
 * - lambdaApi: true → Lambda function + API Gateway (event-driven, scales to zero)
 * - webappS3: true → S3 bucket for static webapp hosting (React Native Web / Expo)
 * - marketingS3: true → S3 bucket for marketing site hosting (Next.js static export)
 * - eventHandlers: true → EventBridge event handler Lambdas (tier-changed, upgrade-handler)
 * - scheduledJobs: [] → Scheduled Lambda jobs with EventBridge rules (auto-matcher, etc.)
 */
export const SaasWorkloadAppSchema = z.object({
  /**
   * Brand/application name (e.g., "savvue", "equitrio", "core")
   * Used for resource naming: api-{name}, db-{name}, webapp-{name}
   */
  name: z.string().min(1),

  /**
   * Domain name for this brand (e.g., "savvue.com")
   * Optional for shared services like "core" that don't have a domain
   */
  domain: z.string().min(1).optional(),

  /**
   * Create an ECS Fargate webapp service for this brand
   * Creates: webapp-{name} ECS service
   * @default false
   */
  webapp: z.boolean().optional(),

  /**
   * Create a Lambda API function for this brand
   * Creates: Lambda api-{name} + database schema db-{name}
   * Connects to Aurora via RDS Proxy
   * @default false
   */
  lambdaApi: z.boolean().optional(),

  /**
   * Create an S3 bucket for static webapp hosting (React Native Web / Expo)
   * Creates: S3 bucket webapp-{name} in workload account
   * SSM Parameter: /codeiqlabs/saas/{env}/webapp/{name}/bucket-name
   * CloudFront in management account accesses via cross-account OAC
   * @default false
   */
  webappS3: z.boolean().optional(),

  /**
   * Create an S3 bucket for marketing site hosting (Next.js static export)
   * Creates: S3 bucket static-{name} in workload account
   * SSM Parameter: /codeiqlabs/saas/{env}/static/{name}/bucket-name
   * CloudFront in management account accesses via cross-account OAC
   * @default false
   */
  marketingS3: z.boolean().optional(),

  /**
   * LEGACY: ECS services array (deprecated, use webapp/lambdaApi instead)
   * Kept for backward compatibility during migration
   * @deprecated Use webapp: true and/or lambdaApi: true instead
   */
  services: z
    .array(
      z.object({
        type: ServiceTypeSchema,
      }),
    )
    .optional(),

  /**
   * Create EventBridge event handler Lambda functions for this brand
   * Currently only creates auto-matcher-handler for brands that need it
   * Note: upgrade-handler and trial-expiry handlers were removed - tier is now read from JWT only
   * @default false
   */
  eventHandlers: z.boolean().optional(),

  /**
   * Enable scheduled cleanup of expired refresh tokens
   * Creates: Lambda function + EventBridge rule (daily at 2 AM EST)
   * Cleans up expired refresh tokens from DynamoDB core table
   * @default false
   */
  refreshTokenCleanup: z.boolean().optional(),

  /**
   * Stripe configuration for this brand
   * Environment-specific (stripe.nprd, stripe.prod)
   * Price IDs are injected as Lambda environment variables:
   * - STRIPE_PRICE_ID_MONTHLY_{BRAND} (uppercase brand name)
   * - STRIPE_PRICE_ID_ANNUAL_{BRAND} (uppercase brand name)
   *
   * @example
   * ```yaml
   * stripe:
   *   nprd:
   *     priceIdMonthly: "price_1Sm1sdDjOkuN3FpRw3vTUC2p"
   *     priceIdAnnual: "price_1Sm1shDjOkuN3FpRr9JQedbm"
   *   prod:
   *     priceIdMonthly: "price_live_monthly_xxx"
   *     priceIdAnnual: "price_live_annual_xxx"
   * ```
   */
  stripe: z
    .record(
      z.object({
        /** Monthly subscription price ID */
        priceIdMonthly: z.string().optional(),
        /** Annual subscription price ID */
        priceIdAnnual: z.string().optional(),
      }),
    )
    .optional(),

  /**
   * Scheduled background jobs configuration for this brand
   * Creates Lambda functions with EventBridge scheduled rules
   * Jobs run periodic tasks like transaction matching, unlock checking, budget rollovers
   *
   * @example
   * ```yaml
   * scheduledJobs:
   *   - name: auto-matcher
   *     description: "Generate Smart Suggestions for uncategorized transactions"
   *     schedule: "rate(1 hour)"
   *     memorySize: 1024
   *     timeout: 300
   *   - name: unlock-checker
   *     schedule: "rate(15 minutes)"
   *   - name: rollover
   *     schedule: "cron(0 6 1 * ? *)"
   * ```
   */
  scheduledJobs: z
    .array(
      z.object({
        /**
         * Job name (e.g., 'auto-matcher', 'unlock-checker', 'rollover')
         * Used for Lambda function naming and ECR image command
         */
        name: z.string().min(1),

        /**
         * Human-readable description of what the job does
         */
        description: z.string().optional(),

        /**
         * EventBridge schedule expression
         * Supports both rate and cron expressions:
         * - rate(1 hour), rate(15 minutes), rate(1 day)
         * - cron(0 6 1 * ? *) - 1st of month at 6 AM UTC
         * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-scheduled-rule-pattern.html
         */
        schedule: z.string().min(1),

        /**
         * Memory size in MB
         * More memory = more CPU = faster execution
         * @default 1024
         */
        memorySize: z.number().min(128).max(10240).optional(),

        /**
         * Timeout in seconds
         * Background jobs may need longer timeouts than API handlers
         * @default 300 (5 minutes)
         */
        timeout: z.number().min(1).max(900).optional(),

        /**
         * Whether the schedule rule is enabled
         * Set to false to disable the job without removing it
         * @default true
         */
        enabled: z.boolean().optional(),
      }),
    )
    .optional(),
});

export type SaasWorkloadApp = z.infer<typeof SaasWorkloadAppSchema>;

/**
 * Scheduled job configuration type
 */
export type ScheduledJobConfig = NonNullable<SaasWorkloadApp['scheduledJobs']>[number];

/**
 * Unified Application Configuration Schema
 *
 * This single schema supports all deployment patterns:
 * - Single-account deployments (management, shared services, etc.)
 * - Multi-environment deployments (workload applications)
 * - Mixed deployments (management account with workload components)
 *
 * Components are enabled by including them in the manifest with enabled: true
 */
export const UnifiedAppConfigSchema = z.object({
  /**
   * Naming configuration - defines company and project for stack/resource naming
   * Pattern: {company}-{project}-{environment}-{component}-Stack
   */
  naming: NamingConfigSchema,

  /**
   * Environment deployment configurations
   * Required: at least one environment must be defined (e.g., mgmt, nprd, prod)
   * Orchestrator derives deployment target from 'mgmt' environment or first environment
   */
  environments: z.record(EnvironmentConfigSchema),

  /**
   * Default configuration values for ECS, Lambda, and Aurora
   * These are used when saasWorkload-derived infrastructure is created
   */
  defaults: z
    .object({
      ecs: z
        .object({
          webapp: z
            .object({
              cpu: z.number().default(256),
              memoryMiB: z.number().default(512),
              desiredCount: z.number().default(1),
            })
            .optional(),
          api: z
            .object({
              cpu: z.number().default(512),
              memoryMiB: z.number().default(1024),
              desiredCount: z.number().default(1),
            })
            .optional(),
        })
        .optional(),
      lambda: z
        .object({
          /** Memory size in MB (more memory = more CPU = faster cold starts) */
          memorySize: z.number().min(128).max(10240).default(1024),
          /** Timeout in seconds */
          timeout: z.number().min(1).max(900).default(30),
          /**
           * EventBridge bus name for async event publishing
           * Supports {env} placeholder which is replaced with environment name
           * @example "saas-{env}-events" → "saas-nprd-events"
           */
          eventBridgeBusName: z.string().optional(),
        })
        .optional(),
      aurora: z
        .object({
          minCapacity: z.number().default(0.5),
          maxCapacity: z.number().default(2),
          engineVersion: z.string().default('16.4'),
        })
        .optional(),
    })
    .optional(),

  /**
   * SaaS Applications (Brands) - Convention-over-Configuration (LEGACY)
   *
   * Each entry defines a brand/application. Infrastructure is automatically derived:
   * - All brands: S3 bucket for static hosting, database, secrets, origin zone
   * - marketingOnly: true → Only S3 bucket (no webapp, API, or database)
   * - hasApi: true → Creates api-{name} ECS service with DATABASE_URL_CORE + DATABASE_URL_{BRAND}
   * - hasWebapp: true (default for non-marketing) → Creates webapp ECS service
   *
   * This replaces explicit compute.ecs.services[], staticHosting.sites[], etc.
   *
   * @deprecated Use saasEdge (customization-aws) and saasWorkload (saas-aws) instead
   */
  saasApps: z.array(SaasAppSchema).optional(),

  /**
   * SaaS Edge Configuration (customization-aws)
   *
   * Defines CloudFront distributions, S3 buckets, Route53 zones, and ACM certificates.
   * All resources created in management account.
   *
   * Each entry defines distributions for a domain:
   * - marketing: Creates {domain} → CloudFront → S3 (static site) via OAC
   * - webapp: Creates app.{domain} → CloudFront → VPC Origin → ALB
   * - api: Creates api.{domain} → CloudFront → VPC Origin → ALB
   */
  saasEdge: z.array(SaasEdgeAppSchema).optional(),

  /**
   * SaaS Workload Configuration (saas-aws)
   *
   * Defines ECS services, Aurora databases, Secrets, and Origin Zones.
   * All resources created in workload accounts (nprd/prod).
   *
   * Each entry defines services for a brand:
   * - webapp: Creates webapp-{name} ECS service + Aurora DB + Secrets
   * - api: Creates api-{name} ECS service (shares Aurora DB)
   */
  saasWorkload: z.array(SaasWorkloadAppSchema).optional(),

  // ============================================================================
  // COMPONENT SECTIONS - All Optional
  // Presence implies enabled - no 'enabled: true' flags needed
  // ============================================================================

  /**
   * AWS Organizations configuration
   * Typically deployed to organization management account
   * Defines organizational units, service control policies, and account management
   */
  organization: OrganizationSchema.optional(),

  /**
   * AWS Identity Center (SSO) configuration
   * Typically deployed to organization management account
   * Defines centralized identity management, permission sets, and account assignments
   */
  identityCenter: IdentityCenterSchema.optional(),

  /**
   * Domain management configuration
   * Can be deployed to any account
   * Defines centralized domain management, DNS delegation, and SSL certificates
   */
  domains: DomainManagementSchema.optional(),

  /**
   * GitHub deploy permissions configuration (legacy)
   * Enables GitHub OIDC + deploy roles for SaaS UI deployments
   */
  githubDeployPermissions: GitHubDeployPermissionsSchema.optional(),

  /**
   * GitHub OIDC configuration
   * Creates GitHub Actions OIDC identity provider and IAM roles in workload accounts
   * for CI/CD deployments without long-lived credentials
   */
  githubOidc: GitHubOidcConfigSchema.optional(),

  /**
   * Networking configuration
   * Deploys to environments defined in the environments section
   * Creates VPCs, subnets, security groups, and network infrastructure
   * Presence implies enabled - no 'enabled' flag needed
   */
  networking: z
    .object({
      vpc: z
        .object({
          cidr: z.string().optional(),
          maxAzs: z.number().min(1).max(3).optional(),
          natGateways: z.number().min(0).max(3).optional(),
          enableFlowLogs: z.boolean().optional(),
          flowLogsRetentionDays: z.number().optional(),
        })
        .optional(),
    })
    .optional(),

  /**
   * Compute configuration
   * Deploys ECS Fargate services with shared ALB for multi-brand applications
   * Creates ECR repositories, ECS services, ALB with path-based routing
   */
  compute: z
    .object({
      ecs: EcsComputeConfigSchema.optional(),
    })
    .optional(),

  /**
   * Database configuration
   * Aurora Serverless v2 cluster hosting multiple brand databases
   */
  aurora: AuroraConfigSchema.optional(),

  /**
   * Static hosting configuration
   * Creates S3 buckets for static web app hosting (Expo Web builds)
   * CloudFront distribution is created in Management account
   *
   * When saasApps is present, static hosting is derived from it.
   * Presence implies enabled - no 'enabled' flag needed
   */
  staticHosting: z
    .object({
      /**
       * Management account ID for CloudFront OAC access
       */
      managementAccountId: AwsAccountIdSchema.optional(),
    })
    .optional(),

  /**
   * Secrets configuration
   * Creates AWS Secrets Manager secrets for application configuration
   * Secrets are created with placeholder values that need to be updated after deployment
   * Presence implies enabled - no 'enabled' flag needed
   */
  secrets: z
    .object({
      /**
       * Secret retention period in days when deleted
       * @default 7
       */
      recoveryWindowInDays: z.number().min(7).max(30).optional(),
      /**
       * List of brands for per-brand secrets
       * Used when a secret item has perBrand: true
       */
      brands: z.array(z.string()).optional(),
      /**
       * Secret items to create
       */
      items: z
        .array(
          z.object({
            /**
             * Secret key - used in the secret name: {project}/{env}/{key}
             */
            key: z.string(),
            /**
             * Human-readable description of the secret
             */
            description: z.string().optional(),
            /**
             * If true, auto-generate a random secret value
             * @default false
             */
            generated: z.boolean().optional(),
            /**
             * Length of generated secret (only used when generated: true)
             * @default 32
             */
            length: z.number().min(16).max(128).optional(),
            /**
             * If true, create one secret per brand: {project}/{env}/{key}/{brand}
             * Requires brands array to be defined
             * @default false
             */
            perBrand: z.boolean().optional(),
            /**
             * If provided, creates a JSON secret with these fields as keys
             * Each field gets a placeholder value
             */
            jsonFields: z.array(z.string()).optional(),
          }),
        )
        .optional(),
    })
    .optional(),

  /**
   * Origin zones configuration
   * Creates Route53 hosted zones for origin-{env}.{brand} subdomains
   * Used for stable ALB origin hostnames that CloudFront can reference
   * Presence implies enabled - no 'enabled' flag needed
   */
  originZones: z
    .object({
      /**
       * Brand domains to create origin zones for
       * Creates zones like: origin-nprd.savvue.com, origin-prod.savvue.com
       */
      brands: z.array(z.string()),
    })
    .optional(),

  /**
   * Lambda functions configuration
   * Creates Lambda functions from ECR images with VPC connectivity to RDS Proxy
   * Used for API services in Lambda-first architecture
   */
  lambda: z
    .object({
      /**
       * Lambda functions to create
       */
      functions: z
        .array(
          z.object({
            /**
             * Function name (e.g., 'api-core', 'api-savvue')
             * Used for resource naming: saas-{env}-{name}
             */
            name: z.string().min(1),
            /**
             * Memory size in MB
             * More memory = more CPU = faster cold starts
             * @default 1024
             */
            memorySize: z.number().min(128).max(10240).optional(),
            /**
             * Timeout in seconds
             * @default 30
             */
            timeout: z.number().min(1).max(900).optional(),
            /**
             * Reserved concurrent executions
             * Set to 0 to disable the function
             */
            reservedConcurrentExecutions: z.number().min(0).optional(),
            /**
             * Additional environment variables
             */
            environment: z.record(z.string()).optional(),
            /**
             * ECR repository name override
             * @default name (e.g., 'api-core')
             */
            ecrRepositoryName: z.string().optional(),
            /**
             * ECR image tag
             * @default 'latest'
             */
            imageTag: z.string().optional(),
          }),
        )
        .optional(),
      /**
       * EventBridge bus name for event publishing
       */
      eventBridgeBusName: z.string().optional(),
    })
    .optional(),

  /**
   * Infrastructure configuration for customization-aws
   * Creates VPC, ALB, and VPC Origin stacks in workload accounts
   * These resources are shared with saas-aws via SSM parameters
   */
  infrastructure: z
    .object({
      /**
       * Target environments to deploy infrastructure to
       * References keys from the environments section
       */
      targetEnvironments: z.array(z.string()).optional(),
      /**
       * When true, VPC/ALB are imported from customization-aws via SSM
       * instead of being created by this stack.
       * This requires customization-aws to be deployed first.
       * @default false
       */
      importVpcFromSsm: z.boolean().optional(),
      /**
       * VPC configuration
       */
      vpc: z
        .object({
          cidr: z.string().optional(),
          maxAzs: z.number().min(1).max(3).optional(),
          natGateways: z.number().min(0).max(3).optional(),
          enableFlowLogs: z.boolean().optional(),
          flowLogsRetentionDays: z.number().optional(),
        })
        .optional(),
      /**
       * ALB configuration
       */
      alb: z
        .object({
          /**
           * Whether the ALB is internal (private) or internet-facing
           * @default true (internal for VPC Origins)
           */
          internal: z.boolean().optional(),
        })
        .optional(),
      /**
       * Common SSM parameters to deploy to workload accounts
       * Values are derived from the environments section
       */
      commonParams: z
        .object({
          /**
           * Create SSM parameters for account IDs
           * When true, creates:
           * - /codeiqlabs/org/account-id (from current environment's accountId)
           * - /codeiqlabs/org/management-account-id (from environments.mgmt.accountId)
           * @default false
           */
          accountIds: z.boolean().optional(),
        })
        .optional(),
    })
    .optional(),
});

/**
 * Type inference for the unified application configuration
 */
export type UnifiedAppConfig = z.infer<typeof UnifiedAppConfigSchema>;
export type NamingConfig = z.infer<typeof NamingConfigSchema>;
export type DeploymentTarget = z.infer<typeof DeploymentTargetSchema>;
export type EnvironmentConfig = z.infer<typeof EnvironmentConfigSchema>;

/**
 * Validation functions
 */
export function validateUnifiedAppConfig(config: unknown): UnifiedAppConfig {
  return UnifiedAppConfigSchema.parse(config);
}

export function safeValidateUnifiedAppConfig(config: unknown) {
  return UnifiedAppConfigSchema.safeParse(config);
}
