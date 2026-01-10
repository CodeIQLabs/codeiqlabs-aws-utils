// Core functions
export * from './functions';
export { generateStageName } from './functions';

// Convenience classes and utilities
export * from './convenience';

// Type definitions (explicit exports for better IDE support)
export type {
  ProjectName,
  CompanyName,
  Environment,
  ExtendedEnvironment,
  NamingConfig,
  NamingProvider,
  NamingInput,
  ExportNameOptions,
  IAMNamingOptions,
  S3NamingOptions,
  ResourceType,
  StackNameOptions,
  BaseParamOpts,
  StringParamOpts,
  BatchParamOpts,
  // Re-exported from tagging module for convenience
  ExtraTags,
  TaggingOptions,
} from './types';

// Utility functions from types
export { resolveNaming, sanitizeForConstructId } from './types';
