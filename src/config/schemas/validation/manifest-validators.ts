// NEW FILE - Unified manifest validation
import { z } from 'zod';
import {
  ManagementAppConfigSchema,
  WorkloadAppConfigSchema,
  SharedServicesAppConfigSchema,
} from '../applications';

/**
 * Union type for all supported manifest types
 */
export const AnyManifestSchema = z.discriminatedUnion('type', [
  ManagementAppConfigSchema,
  WorkloadAppConfigSchema,
  SharedServicesAppConfigSchema,
]);

/**
 * Validates any manifest file and returns the appropriate typed result
 */
export function validateManifest(data: unknown):
  | {
      success: true;
      data: z.infer<typeof AnyManifestSchema>;
      type: 'management' | 'workload' | 'shared';
    }
  | { success: false; error: z.ZodError } {
  const result = AnyManifestSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data, type: result.data.type };
  }
  return { success: false, error: result.error };
}

export type AnyManifestConfig = z.infer<typeof AnyManifestSchema>;
