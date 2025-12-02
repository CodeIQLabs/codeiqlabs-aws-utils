import { z } from 'zod';

/**
 * GitHub deploy permissions configuration
 *
 * Enables the GitHubDeployPermissions component to synth stacks for
 * GitHub OIDC + deploy IAM roles. Role mode allows choosing between
 * least-privilege (per-surface) or a single consolidated role.
 */
export const GitHubDeployPermissionsSchema = z.object({
  /** Enable or disable the component */
  enabled: z.boolean().default(true),
  /**
   * Role allocation strategy:
   * - split: per-surface roles (marketing/web/api) for least privilege
   * - single: one consolidated role per environment
   */
  roleMode: z.enum(['split', 'single']).default('split'),
});

export type GitHubDeployPermissions = z.infer<typeof GitHubDeployPermissionsSchema>;
