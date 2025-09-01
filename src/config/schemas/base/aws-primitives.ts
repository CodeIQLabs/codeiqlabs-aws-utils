import { z } from 'zod';

/**
 * AWS-specific primitive schema components for CodeIQLabs configuration files
 *
 * This module provides validation patterns for AWS-specific data types
 * like account IDs, regions, and other AWS resource identifiers.
 */

/**
 * AWS Region validation - matches enhanced JSON Schema pattern
 */
export const AwsRegionSchema = z
  .string()
  .regex(
    /^[a-z]{2}-[a-z]+-\d{1,2}$/,
    'AWS Region must follow the format: {region}-{location}-{number} (e.g., "us-east-1")',
  );

/**
 * AWS Account ID validation - must be exactly 12 digits
 */
export const AwsAccountIdSchema = z
  .string()
  .regex(/^[0-9]{12}$/, 'AWS Account ID must be exactly 12 digits');

// Export types for TypeScript usage
export type AwsRegion = z.infer<typeof AwsRegionSchema>;
export type AwsAccountId = z.infer<typeof AwsAccountIdSchema>;
