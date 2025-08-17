import { z } from 'zod';
import { ProjectNameSchema, CompanyNameSchema } from '../base';
import { ManagementConfigSchema } from '../resources/accounts';
import { OrganizationSchema } from '../resources/organizations';
import { IdentityCenterSchema } from '../resources/identity-center';

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
export const ManagementAppConfigSchema = z.object({
  project: ProjectNameSchema,
  company: CompanyNameSchema,
  management: ManagementConfigSchema,
  organization: OrganizationSchema,
  identityCenter: IdentityCenterSchema,
});

// Export the type for TypeScript usage
export type ManagementAppConfig = z.infer<typeof ManagementAppConfigSchema>;
