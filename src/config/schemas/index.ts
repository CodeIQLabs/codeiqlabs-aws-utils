/**
 * Configuration schemas for CodeIQLabs AWS projects
 *
 * This module provides comprehensive Zod schemas for validating AWS configurations.
 * Schemas are organized into logical categories for better maintainability and
 * developer experience.
 */

// Re-export all schema categories
export * from './base';
export * from './resources';
export * from './applications';

/**
 * Convenience re-exports organized by category
 */

// Base schemas - foundational building blocks
export {
  // Primitive schemas
  EmailSchema,
  KeySchema,
  NameSchema,
  DescriptionSchema,
  BooleanSchema,
  ConfigModeSchema,
  ISO8601DurationSchema,
  UrlSchema,
  // AWS primitive schemas
  AwsRegionSchema,
  AwsAccountIdSchema,
  // Common schemas
  EnvironmentSchema,
  ProjectNameSchema,
  CompanyNameSchema,
  TagsSchema,
  ManifestCoreSchema,
  ManifestContextSchema,
  ManifestBaseSchema,
} from './base';

// Resource schemas - AWS service-specific
export {
  // Account and management schemas
  AccountConfigSchema,
  ManagementConfigSchema,
  ManagedPolicyArnSchema,
  ServicePrincipalSchema,
  ArnSchema,
  // Organization schemas
  OrganizationalUnitSchema,
  OrganizationSchema,
  ServiceControlPolicySchema,
  // Identity Center schemas
  UserConfigSchema,
  PermissionSetConfigSchema,
  SSOAssignmentConfigSchema,
  IdentityCenterSchema,
  ApplicationConfigSchema,
  // IAM schemas
  CrossAccountRoleSchema,
  // GitHub OIDC schemas
  GitHubOidcSchema,
  // Aurora schemas
  AuroraConfigSchema,
  // Project schemas
  ProjectEnvironmentSchema,
  ProjectSchema,
  // Networking schemas
  NetworkingConfigSchema,
  VpcConfigSchema,
  // Security schemas
  SecurityConfigSchema,
  SecurityGroupConfigSchema,
  IamRoleConfigSchema,
  KmsKeyConfigSchema,
  // Compliance schemas
  ComplianceConfigSchema,
  CloudTrailConfigSchema,
  ConfigServiceConfigSchema,
  GuardDutyConfigSchema,
  SecurityHubConfigSchema,
  // Domain management schemas
  DomainManagementSchema,
  RegisteredDomainSchema,
  DomainDelegationSchema,
  CertificateConfigSchema,
} from './resources';

// NEW: Unified application schema (recommended)
export {
  UnifiedAppConfigSchema,
  validateUnifiedAppConfig,
  safeValidateUnifiedAppConfig,
} from './applications';

// Unified manifest schema (replaces legacy discriminated union)
export { UnifiedAppConfigSchema as ManifestSchema } from './applications';

/**
 * Convenience re-exports for commonly used types
 */

// Base types
export type {
  // Primitive types
  Email,
  Key,
  Name,
  Description,
  ConfigMode,
  ISO8601Duration,
  Url,
  // AWS primitive types
  AwsRegion,
  AwsAccountId,
  // Common types
  Environment,
  ProjectName,
  CompanyName,
  Tags,
  ManifestCore,
  ManifestContext,
  ManifestBase,
} from './base';

// Resource types
export type {
  // Account and management types
  AccountConfig,
  ManagementConfig,
  ManagedPolicyArn,
  ServicePrincipal,
  Arn,
  // Organization types
  OrganizationalUnitConfig,
  OrganizationConfig,
  ServiceControlPolicyConfig,
  // Identity Center types
  UserConfig,
  PermissionSetConfig,
  SSOAssignmentConfig,
  IdentityCenterConfig,
  ApplicationConfig,
  // IAM types
  CrossAccountRole,
  // GitHub OIDC types
  GitHubOidc,
  // Aurora types
  AuroraConfig,
  // Project types
  ProjectEnvironment,
  Project,
  // Networking types
  NetworkingConfig,
  VpcConfig,
  SubnetConfig,
  SecurityGroupConfig,
  // Security types
  SecurityConfig,
  IamRoleConfig,
  KmsKeyConfig,
  IamPolicyDocument,
  // Compliance types
  ComplianceConfig,
  CloudTrailConfig,
  ConfigServiceConfig,
  GuardDutyConfig,
  SecurityHubConfig,
} from './resources';

// Unified application types
export type { UnifiedAppConfig, DeploymentTarget, EnvironmentConfig } from './applications';
