/**
 * Base schema components for CodeIQLabs configuration files
 *
 * This module provides foundational validation patterns and schemas
 * that serve as building blocks for more complex configurations.
 */

// Re-export all primitive schemas and types
export * from './primitives';

// Re-export all AWS-specific primitive schemas and types
export * from './aws-primitives';

// Re-export all common schemas and types
export * from './common';

export * from './manifest-base';

/**
 * Convenience re-exports for the most commonly used base schemas
 */
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
} from './primitives';

export {
  // AWS primitive schemas
  AwsRegionSchema,
  AwsAccountIdSchema,
} from './aws-primitives';

export {
  // Common schemas
  EnvironmentSchema,
  ProjectNameSchema,
  CompanyNameSchema,
  TagsSchema,
} from './common';

export {
  ManifestCoreSchema,
  ManifestContextSchema,
  ManagementRefSchema,
  ManifestBaseSchema,
} from './manifest-base';

/**
 * Convenience re-exports for the most commonly used base types
 */
export type {
  // Primitive types
  Email,
  Key,
  Name,
  Description,
  ConfigMode,
  ISO8601Duration,
  Url,
} from './primitives';

export type {
  // AWS primitive types
  AwsRegion,
  AwsAccountId,
} from './aws-primitives';

export type {
  // Common types
  Environment,
  ProjectName,
  CompanyName,
  Tags,
} from './common';

export type { ManifestCore, ManifestContext, ManagementRef, ManifestBase } from './manifest-base';
