/**
 * Unified manifest validation for CodeIQLabs AWS projects
 *
 * This module provides auto-detection and validation capabilities for all
 * supported manifest types using discriminated unions.
 */

import { z } from 'zod';
import {
  ManagementAppConfigSchema,
  WorkloadAppConfigSchema,
  SharedServicesAppConfigSchema,
  BaselineAppConfigSchema,
} from '../applications';

/**
 * Union type for all supported manifest types
 * Uses discriminated union on the 'type' field for automatic type detection
 */
export const AnyManifestSchema = z.discriminatedUnion('type', [
  ManagementAppConfigSchema,
  WorkloadAppConfigSchema,
  SharedServicesAppConfigSchema,
  BaselineAppConfigSchema,
]);

/**
 * Validates any manifest file and returns the appropriate typed result
 *
 * @param data - The manifest data to validate
 * @returns Success result with typed data and detected type, or error result
 */
export function validateManifest(data: unknown):
  | {
      success: true;
      data: z.infer<typeof AnyManifestSchema>;
      type: 'management' | 'workload' | 'shared-services' | 'baseline';
    }
  | { success: false; error: z.ZodError } {
  const result = AnyManifestSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data, type: result.data.type };
  }
  return { success: false, error: result.error };
}

/**
 * Type alias for any supported manifest configuration
 */
export type AnyManifestConfig = z.infer<typeof AnyManifestSchema>;
