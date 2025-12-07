import { z } from 'zod';
import { ISO8601DurationSchema, AwsAccountIdSchema, AwsRegionSchema } from '../base';

/**
 * GitHub OIDC configuration schemas for CodeIQLabs AWS projects
 *
 * This module provides validation schemas for GitHub OpenID Connect (OIDC)
 * provider configurations used for secure CI/CD deployments without
 * long-lived AWS credentials.
 */

/**
 * Simple GitHub OIDC configuration (legacy)
 * Defines GitHub OIDC provider settings for CI/CD
 */
export const GitHubOidcSchema = z.object({
  enabled: z.boolean().default(true),
  repositoryPattern: z.string().min(1, 'Repository pattern is required'),
  roleName: z.string().min(1, 'Role name is required'),
  sessionDuration: ISO8601DurationSchema.optional(),
});

export type GitHubOidc = z.infer<typeof GitHubOidcSchema>;

/**
 * GitHub repository configuration for OIDC trust policy
 */
export const GitHubRepositoryConfigSchema = z.object({
  /** GitHub organization or user name */
  owner: z.string().min(1, 'Owner is required'),
  /** Repository name */
  repo: z.string().min(1, 'Repository name is required'),
  /** Branch filter (e.g., 'main', 'refs/heads/main', '*') - defaults to 'main' */
  branch: z.string().optional().default('main'),
  /** Allow version tags (e.g., 'v*.*.*') - defaults to true */
  allowTags: z.boolean().optional().default(true),
});

export type GitHubRepositoryConfig = z.infer<typeof GitHubRepositoryConfigSchema>;

/**
 * Environment configuration for GitHub OIDC deployment
 */
export const GitHubOidcEnvironmentSchema = z.object({
  /** Environment name (e.g., 'nprd', 'prod') */
  name: z.string().min(1, 'Environment name is required'),
  /** AWS account ID for this environment */
  accountId: AwsAccountIdSchema,
  /** AWS region for this environment */
  region: AwsRegionSchema,
});

export type GitHubOidcEnvironment = z.infer<typeof GitHubOidcEnvironmentSchema>;

/**
 * Target configuration for GitHub OIDC
 * Defines which repositories can deploy to which environments
 */
export const GitHubOidcTargetSchema = z.object({
  /** Project name for resource naming */
  projectName: z.string().min(1, 'Project name is required'),
  /** GitHub repositories that can assume the role */
  repositories: z.array(GitHubRepositoryConfigSchema).min(1, 'At least one repository is required'),
  /**
   * ECR repository name prefix for push permissions
   * If not provided, derived from {company}-{project} pattern
   */
  ecrRepositoryPrefix: z.string().optional(),
  /**
   * S3 bucket name prefix for webapp deployment
   * If not provided, derived from {company}-{project} pattern
   */
  s3BucketPrefix: z.string().optional(),
  /**
   * ECS cluster name prefix for service updates
   * If not provided, derived from {company}-{project} pattern
   */
  ecsClusterPrefix: z.string().optional(),
  /** Environments to deploy to */
  environments: z.array(GitHubOidcEnvironmentSchema).min(1, 'At least one environment is required'),
});

export type GitHubOidcTarget = z.infer<typeof GitHubOidcTargetSchema>;

/**
 * Full GitHub OIDC configuration for multi-project, multi-environment deployments
 * Creates OIDC identity provider and IAM roles in workload accounts
 */
export const GitHubOidcConfigSchema = z.object({
  /** Enable or disable the component */
  enabled: z.boolean().default(true),
  /** Targets with their repository and environment configurations */
  targets: z.array(GitHubOidcTargetSchema).min(1, 'At least one target is required'),
});

export type GitHubOidcConfig = z.infer<typeof GitHubOidcConfigSchema>;
