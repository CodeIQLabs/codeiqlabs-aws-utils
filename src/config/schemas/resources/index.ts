/**
 * AWS resource configuration schemas for CodeIQLabs projects
 *
 * This module provides comprehensive Zod schemas for validating AWS resource
 * configurations. The schemas are organized following AWS service alignment
 * for better maintainability and reusability.
 */

// Re-export all AWS resource schemas and types
export * from './accounts';
export * from './organizations';
export * from './identity-center';
export * from './iam';
export * from './github-oidc';
export * from './deployment-permissions';
export * from './projects';

/**
 * Convenience re-exports for commonly used resource schemas
 */
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
} from './accounts';

export {
  // Organization schemas
  OrganizationalUnitSchema,
  OrganizationSchema,
  ServiceControlPolicySchema,
  AccountCreationRequestSchema,
  DelegatedAdministratorSchema,
} from './organizations';

export {
  // Identity Center schemas
  PermissionSetConfigSchema,
  SSOAssignmentConfigSchema,
  IdentityCenterSchema,
  ApplicationConfigSchema,
  AccountAssignmentRequestSchema,
} from './identity-center';

export {
  // IAM schemas
  CrossAccountRoleSchema,
} from './iam';

export {
  // GitHub OIDC schemas
  GitHubOidcSchema,
} from './github-oidc';

export {
  // Deployment permissions schemas
  DeploymentPermissionsSchema,
} from './deployment-permissions';

export {
  // Project schemas
  ProjectEnvironmentSchema,
  ProjectSchema,
} from './projects';

/**
 * Convenience re-exports for commonly used resource types
 */
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
} from './accounts';

export type {
  // Organization types
  OrganizationalUnitConfig,
  OrganizationConfig,
  ServiceControlPolicyConfig,
  AccountCreationRequest,
  DelegatedAdministrator,
} from './organizations';

export type {
  // Identity Center types
  PermissionSetConfig,
  SSOAssignmentConfig,
  IdentityCenterConfig,
  ApplicationConfig,
  AccountAssignmentRequest,
} from './identity-center';

export type {
  // IAM types
  CrossAccountRole,
} from './iam';

export type {
  // GitHub OIDC types
  GitHubOidc,
} from './github-oidc';

export type {
  // Deployment permissions types
  DeploymentPermissions,
} from './deployment-permissions';

export type {
  // Project types
  ProjectEnvironment,
  Project,
} from './projects';
