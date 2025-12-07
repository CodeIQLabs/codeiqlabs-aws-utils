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
export * from './alb-origin-discovery';
export * from './github-deploy-permissions';
export * from './projects';
export * from './domains';
export * from './ecs-service';

/**
 * Convenience re-exports for commonly used resource schemas
 */
export {
  // Account and management schemas
  AccountConfigSchema,
  ManagementConfigSchema,
  ManagedPolicyArnSchema,
  ServicePrincipalSchema,
  ArnSchema,
} from './accounts';

export {
  // Organization schemas
  OrganizationalUnitSchema,
  OrganizationSchema,
  ServiceControlPolicySchema,
} from './organizations';

export {
  // Identity Center schemas
  PermissionSetConfigSchema,
  SSOAssignmentConfigSchema,
  IdentityCenterSchema,
  ApplicationConfigSchema,
} from './identity-center';

export {
  // IAM schemas
  CrossAccountRoleSchema,
} from './iam';

export {
  // GitHub OIDC schemas
  GitHubOidcSchema,
  GitHubOidcConfigSchema,
  GitHubRepositoryConfigSchema,
  GitHubOidcEnvironmentSchema,
  GitHubOidcTargetSchema,
} from './github-oidc';

export {
  // ALB Origin Discovery schemas
  AlbOriginDiscoverySchema,
  AlbOriginDiscoveryTargetSchema,
  AlbOriginDiscoveryEnvironmentSchema,
} from './alb-origin-discovery';

export {
  // GitHub deploy permissions schemas
  GitHubDeployPermissionsSchema,
} from './github-deploy-permissions';

export {
  // Project schemas
  ProjectEnvironmentSchema,
  ProjectSchema,
} from './projects';

export {
  // Domain management schemas
  DomainManagementSchema,
  RegisteredDomainSchema,
  DomainDelegationSchema,
  CertificateConfigSchema,
  HostedZoneIdSchema,
  DomainNameSchema,
} from './domains';

export {
  // Networking schemas
  NetworkingConfigSchema,
  VpcConfigSchema,
  SubnetConfigSchema,
  RouteTableConfigSchema,
  NatGatewayConfigSchema,
  InternetGatewayConfigSchema,
  VpcEndpointConfigSchema,
  VpcFlowLogsConfigSchema,
} from './networking';

export {
  // Security schemas
  SecurityConfigSchema,
  SecurityGroupConfigSchema,
  NetworkAclConfigSchema,
  IamRoleConfigSchema,
  KmsKeyConfigSchema,
  SessionManagerConfigSchema,
} from './security';

export {
  // Compliance schemas
  ComplianceConfigSchema,
  CloudTrailConfigSchema,
  ConfigServiceConfigSchema,
  GuardDutyConfigSchema,
  SecurityHubConfigSchema,
  InspectorConfigSchema,
  AccessAnalyzerConfigSchema,
} from './compliance';

export {
  // ECS Service schemas
  EcsServiceTypeSchema,
  EcsServiceSchema,
  EcsComputeConfigSchema,
} from './ecs-service';

/**
 * Convenience re-exports for commonly used resource types
 */
export type {
  // Account and management types
  AccountConfig,
  ManagementConfig,
  ManagedPolicyArn,
  ServicePrincipal,
  Arn,
} from './accounts';

export type {
  // Organization types
  OrganizationalUnitConfig,
  OrganizationConfig,
  ServiceControlPolicyConfig,
} from './organizations';

export type {
  // Identity Center types
  PermissionSetConfig,
  SSOAssignmentConfig,
  IdentityCenterConfig,
  ApplicationConfig,
} from './identity-center';

export type {
  // IAM types
  CrossAccountRole,
} from './iam';

export type {
  // GitHub OIDC types
  GitHubOidc,
  GitHubOidcConfig,
  GitHubRepositoryConfig,
  GitHubOidcEnvironment,
  GitHubOidcTarget,
} from './github-oidc';

export type {
  // GitHub deploy permissions types
  GitHubDeployPermissions,
} from './github-deploy-permissions';

export type {
  // ALB Origin Discovery types
  AlbOriginDiscovery,
  AlbOriginDiscoveryTarget,
  AlbOriginDiscoveryEnvironment,
} from './alb-origin-discovery';

export type {
  // Project types
  ProjectEnvironment,
  Project,
} from './projects';

export type {
  // Domain management types
  DomainManagement,
  RegisteredDomain,
  DomainDelegation,
  CertificateConfig,
  HostedZoneId,
  DomainName,
  CertificateKeyAlgorithm,
  CertificateValidationMethod,
  DomainRegistrar,
} from './domains';

export type {
  // Networking types
  NetworkingConfig,
  VpcConfig,
  SubnetConfig,
  RouteTableConfig,
  NatGatewayConfig,
  InternetGatewayConfig,
  VpcEndpointConfig,
  VpcFlowLogsConfig,
  CidrBlock,
  AvailabilityZone,
  SubnetType,
} from './networking';

export type {
  // Security types
  SecurityConfig,
  SecurityGroupConfig,
  NetworkAclConfig,
  IamRoleConfig,
  KmsKeyConfig,
  SessionManagerConfig,
  SecurityGroupRule,
  IamPolicyDocument,
} from './security';

export type {
  // Compliance types
  ComplianceConfig,
  CloudTrailConfig,
  ConfigServiceConfig,
  GuardDutyConfig,
  SecurityHubConfig,
  InspectorConfig,
  AccessAnalyzerConfig,
} from './compliance';

export type {
  // ECS Service types
  EcsServiceType,
  EcsService,
  EcsComputeConfig,
} from './ecs-service';
