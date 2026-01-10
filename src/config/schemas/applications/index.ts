/**
 * Application configuration schemas for CodeIQLabs AWS projects
 *
 * This module provides the unified application configuration schema that
 * combines multiple resource schemas into a complete application configuration.
 */

// Re-export unified application schema
export * from './unified';

/**
 * Convenience re-exports for commonly used application schemas
 */
export {
  UnifiedAppConfigSchema,
  SaasAppSchema,
  SaasEdgeAppSchema,
  SaasWorkloadAppSchema,
  DistributionTypeSchema,
  ServiceTypeSchema,
  validateUnifiedAppConfig,
  safeValidateUnifiedAppConfig,
  type UnifiedAppConfig,
  type SaasApp,
  type SaasEdgeApp,
  type SaasWorkloadApp,
  type DistributionType,
  type ServiceType,
  type DeploymentTarget,
  type EnvironmentConfig,
} from './unified';
