/**
 * Unified manifest validation for CodeIQLabs AWS projects
 *
 * This module provides auto-detection and validation capabilities for all
 * supported manifest types using discriminated unions.
 */

import { z } from 'zod';
import { ManifestSchema, UnifiedAppConfigSchema } from '../index';

/**
 * Validates any manifest file with support for both unified and legacy formats
 *
 * @param data - The manifest data to validate
 * @returns Success result with typed data and detected type, or error result
 */
export function validateManifest(data: unknown):
  | {
      success: true;
      data: z.infer<typeof ManifestSchema> | z.infer<typeof UnifiedAppConfigSchema>;
      type: 'management' | 'workload' | 'shared-services' | 'baseline' | 'unified';
    }
  | { success: false; error: z.ZodError } {
  // Try unified schema first (no type field required)
  const unifiedResult = UnifiedAppConfigSchema.safeParse(data);
  if (unifiedResult.success) {
    return { success: true, data: unifiedResult.data, type: 'unified' };
  }

  // Fall back to legacy discriminated union (requires type field)
  const legacyResult = ManifestSchema.safeParse(data);
  if (legacyResult.success) {
    return { success: true, data: legacyResult.data, type: legacyResult.data.type };
  }

  // Return the unified schema error (more helpful for new manifests)
  return { success: false, error: unifiedResult.error };
}
