// Core functions (CDK-agnostic)
export * from './functions';

// Convenience classes and utilities (CDK-agnostic)
export * from './convenience';

// Type definitions (explicit exports for better IDE support)
export type {
  EnvironmentTag,
  ExtraTags,
  TaggingOptions,
  StandardTags,
  CodeIQLabsStandardTags, // Deprecated alias for backward compatibility
} from './types';

// Environment utilities (re-exported from constants)
export { validateEnvironment, ENV_VALUES, type Environment } from '../constants/environments';

// Note: CDK-specific utilities have been moved to @codeiqlabs/aws-cdk package
// Import from '@codeiqlabs/aws-cdk' for CDK-specific tagging functions like applyStandardTags
