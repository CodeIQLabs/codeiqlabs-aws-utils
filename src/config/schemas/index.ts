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
  PolicyDocumentSchema,
  ManagedPolicyArnSchema,
  ServicePrincipalSchema,
  ArnSchema,
  S3BucketNameSchema,
  StackNameSchema,
  IamRoleNameSchema,
  HostedZoneIdSchema,
  DomainNameSchema,
  AwsTagsSchema,
  // Organization schemas
  OrganizationalUnitSchema,
  OrganizationSchema,
  ServiceControlPolicySchema,
  AccountCreationRequestSchema,
  DelegatedAdministratorSchema,
  // Identity Center schemas
  PermissionSetConfigSchema,
  SSOAssignmentConfigSchema,
  IdentityCenterSchema,
  ApplicationConfigSchema,
  AccountAssignmentRequestSchema,
  // IAM schemas
  CrossAccountRoleSchema,
  // GitHub OIDC schemas
  GitHubOidcSchema,
  // Deployment permissions schemas
  DeploymentPermissionsSchema,
  // Project schemas
  ProjectEnvironmentSchema,
  ProjectSchema,
} from './resources';

export {
  ManagementAppConfigSchema,
  WorkloadAppConfigSchema,
  SharedServicesAppConfigSchema,
} from './applications';

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
  PolicyDocument,
  ManagedPolicyArn,
  ServicePrincipal,
  Arn,
  S3BucketName,
  StackName,
  IamRoleName,
  HostedZoneId,
  DomainName,
  AwsTags,
  // Organization types
  OrganizationalUnitConfig,
  OrganizationConfig,
  ServiceControlPolicyConfig,
  AccountCreationRequest,
  DelegatedAdministrator,
  // Identity Center types
  PermissionSetConfig,
  SSOAssignmentConfig,
  IdentityCenterConfig,
  ApplicationConfig,
  AccountAssignmentRequest,
  // IAM types
  CrossAccountRole,
  // GitHub OIDC types
  GitHubOidc,
  // Deployment permissions types
  DeploymentPermissions,
  // Project types
  ProjectEnvironment,
  Project,
} from './resources';

// Application types
export type {
  ManagementAppConfig,
  WorkloadAppConfig,
  SharedServicesAppConfig,
} from './applications';
