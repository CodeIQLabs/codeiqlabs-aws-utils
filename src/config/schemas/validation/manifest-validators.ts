/**
 * Unified manifest validation for CodeIQLabs AWS projects
 *
 * This module provides auto-detection and validation capabilities for all
 * supported manifest types using discriminated unions.
 */

import { z } from 'zod';
import { ManifestSchema } from '../index';

/**
 * Validates any manifest file and returns the appropriate typed result
 *
 * @param data - The manifest data to validate
 * @returns Success result with typed data and detected type, or error result
 */
export function validateManifest(data: unknown):
  | {
      success: true;
      data: z.infer<typeof ManifestSchema>;
      type: 'management' | 'workload' | 'shared-services' | 'baseline';
    }
  | { success: false; error: z.ZodError } {
  const result = ManifestSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data, type: result.data.type };
  }
  return { success: false, error: result.error };
}
