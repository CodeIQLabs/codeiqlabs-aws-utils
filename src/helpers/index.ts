/**
 * Helper utilities for CodeIQLabs AWS projects
 *
 * This module provides common utility functions for environment variable handling,
 * validation, and other helper functions used across CodeIQLabs projects.
 */

// Environment variable helpers
export {
  getRequiredEnvVar,
  getRequiredEnvVarStrict,
  getAccountIdFromEnv,
  getEnvVarWithDefault,
  type EnvVarOptions,
} from './env';
