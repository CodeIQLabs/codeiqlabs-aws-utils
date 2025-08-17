import { z } from 'zod';

/**
 * Primitive schema components for CodeIQLabs configuration files
 *
 * This module provides fundamental validation patterns for basic data types
 * that can be reused across different CodeIQLabs projects.
 */

/**
 * Email address validation with enhanced error message
 */
export const EmailSchema = z.string().email('Invalid email address format');

/**
 * Key/identifier validation - alphanumeric with hyphens and underscores
 */
export const KeySchema = z
  .string()
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    'Key must contain only alphanumeric characters, hyphens, and underscores',
  );

/**
 * Name validation - allows alphanumeric, spaces, hyphens, and underscores
 */
export const NameSchema = z
  .string()
  .regex(
    /^[a-zA-Z0-9\s_-]+$/,
    'Name must contain only alphanumeric characters, spaces, hyphens, and underscores',
  )
  .min(1, 'Name cannot be empty');

/**
 * Description validation - non-empty string with reasonable length limit
 */
export const DescriptionSchema = z
  .string()
  .min(1, 'Description cannot be empty')
  .max(500, 'Description too long (max 500 characters)');

/**
 * ISO 8601 duration format validation (for session durations, timeouts, etc.)
 */
export const ISO8601DurationSchema = z
  .string()
  .regex(
    /^P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/,
    'Invalid ISO 8601 duration format (expected: PT1H30M, P1D, etc.)',
  );

/**
 * URL validation with enhanced error message
 */
export const UrlSchema = z.string().url('Invalid URL format');

/**
 * Boolean with string coercion for environment variables
 */
export const BooleanSchema = z.union([
  z.boolean(),
  z.string().transform((val) => {
    const lower = val.toLowerCase();
    if (lower === 'true' || lower === '1' || lower === 'yes') return true;
    if (lower === 'false' || lower === '0' || lower === 'no') return false;
    throw new Error(`Invalid boolean value: ${val}`);
  }),
]);

/**
 * Common configuration mode enum for create vs adopt patterns
 */
export const ConfigModeSchema = z.enum(['create', 'adopt']).default('create');

// Export types for TypeScript usage
export type Email = z.infer<typeof EmailSchema>;
export type Key = z.infer<typeof KeySchema>;
export type Name = z.infer<typeof NameSchema>;
export type Description = z.infer<typeof DescriptionSchema>;
export type ISO8601Duration = z.infer<typeof ISO8601DurationSchema>;
export type Url = z.infer<typeof UrlSchema>;
export type ConfigMode = z.infer<typeof ConfigModeSchema>;
