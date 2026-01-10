/**
 * Unified manifest validation for CodeIQLabs AWS projects
 *
 * This module provides validation capabilities for the unified manifest schema.
 */

import { z } from 'zod';
import { UnifiedAppConfigSchema } from '../index';

/**
 * Validates a manifest file using the unified schema
 *
 * @param data - The manifest data to validate
 * @returns Success result with typed data, or error result
 */
export function validateManifest(data: unknown):
  | {
      success: true;
      data: z.infer<typeof UnifiedAppConfigSchema>;
      type: 'unified';
    }
  | { success: false; error: z.ZodError } {
  const result = UnifiedAppConfigSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data, type: 'unified' };
  }
  return { success: false, error: result.error };
}
