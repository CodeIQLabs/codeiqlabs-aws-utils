// NEW FILE - Shared services application schema
import { z } from 'zod';
import { ManifestBaseSchema } from '../base';

/**
 * Shared services specific configuration
 */
export const SharedServicesConfigSchema = z.object({
  services: z
    .object({
      monitoring: z
        .object({
          enabled: z.boolean().default(true),
          centralLogging: z.boolean().default(true),
        })
        .optional(),
      networking: z
        .object({
          transitGateway: z
            .object({
              enabled: z.boolean().default(false),
              asn: z.number().optional(),
            })
            .optional(),
        })
        .optional(),
    })
    .optional(),
});

/**
 * Complete shared services manifest schema
 */
export const SharedServicesAppConfigSchema = ManifestBaseSchema.merge(
  z.object({
    type: z.literal('shared'),
    sharedServices: SharedServicesConfigSchema,
  }),
);

export type SharedServicesAppConfig = z.infer<typeof SharedServicesAppConfigSchema>;
