import { z } from 'zod';
import { ConfigModeSchema } from '../base';
import { ProjectSchema } from './projects';
import { CrossAccountRoleSchema } from './iam';
import { GitHubOidcSchema } from './github-oidc';

/**
 * Deployment permissions configuration schemas for CodeIQLabs AWS projects
 *
 * This module provides validation schemas for complete deployment permission
 * setups that combine projects, cross-account roles, and CI/CD configurations
 * for secure multi-account AWS deployments.
 */

/**
 * Deployment permissions configuration
 * Defines the complete deployment permissions setup combining
 * projects, cross-account roles, and GitHub OIDC for CI/CD
 */
export const DeploymentPermissionsSchema = z.object({
  enabled: z.boolean().default(true),
  mode: ConfigModeSchema.default('create'),
  projects: z.array(ProjectSchema).min(1, 'At least one project is required'),
  crossAccountRoles: z.array(CrossAccountRoleSchema).optional(),
  githubOidc: GitHubOidcSchema.optional(),
});

export type DeploymentPermissions = z.infer<typeof DeploymentPermissionsSchema>;
