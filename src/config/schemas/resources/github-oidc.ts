import { z } from 'zod';
import { ISO8601DurationSchema } from '../base';

/**
 * GitHub OIDC configuration schemas for CodeIQLabs AWS projects
 *
 * This module provides validation schemas for GitHub OpenID Connect (OIDC)
 * provider configurations used for secure CI/CD deployments without
 * long-lived AWS credentials.
 */

/**
 * GitHub OIDC configuration
 * Defines GitHub OIDC provider settings for CI/CD
 */
export const GitHubOidcSchema = z.object({
  enabled: z.boolean().default(true),
  repositoryPattern: z.string().min(1, 'Repository pattern is required'),
  roleName: z.string().min(1, 'Role name is required'),
  sessionDuration: ISO8601DurationSchema.optional(),
});

export type GitHubOidc = z.infer<typeof GitHubOidcSchema>;
