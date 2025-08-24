import { z } from 'zod';
import { ManifestBaseSchema } from '../base';
import { ManagementConfigSchema } from '../resources';
import { OrganizationSchema } from '../resources';
import { IdentityCenterSchema } from '../resources';

/**
 * Management application configuration schemas for CodeIQLabs projects
 *
 * This module provides standard configuration schemas for AWS management accounts
 * that handle organization setup, identity center, and cross-account management.
 */

/**
 * Standard AWS Management Account Configuration Schema
 *
 * This schema defines the complete configuration structure for CodeIQLabs
 * management AWS accounts. It combines all the necessary components for
 * organization management, identity center setup, and account governance.
 *
 * Projects can use this directly or extend it for project-specific needs.
 */
export const ManagementAppConfigSchema = ManifestBaseSchema.merge(
  z.object({
    type: z.literal('management'),
    management: ManagementConfigSchema,
    organization: OrganizationSchema,
    identityCenter: IdentityCenterSchema,
  }),
);

// Export the type for TypeScript usage
export type ManagementAppConfig = z.infer<typeof ManagementAppConfigSchema>;
