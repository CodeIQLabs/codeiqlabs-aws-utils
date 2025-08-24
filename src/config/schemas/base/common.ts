import { z } from 'zod';
import { ENV_VALUES } from '../../../constants/environments';

/**
 * Common schema components for CodeIQLabs configuration files
 *
 * This module provides common validation patterns and schemas that are
 * frequently used across different CodeIQLabs projects and configurations.
 */

/**
 * Standard environment values used across CodeIQLabs projects
 * Uses the centralized ENV_VALUES from constants: ['np', 'prod', 'mgmt', 'shared']
 */
export const EnvironmentSchema = z.enum(ENV_VALUES);

/**
 * Project name validation - must be a non-empty string
 */
export const ProjectNameSchema = z.string().min(1, 'Project name cannot be empty');

/**
 * Company name validation - must be a non-empty string
 */
export const CompanyNameSchema = z.string().min(1, 'Company name cannot be empty');

/**
 * Tags schema - record of string key-value pairs
 */
export const TagsSchema = z.record(z.string()).optional();

// Export types for TypeScript usage
export type Environment = z.infer<typeof EnvironmentSchema>;
export type ProjectName = z.infer<typeof ProjectNameSchema>;
export type CompanyName = z.infer<typeof CompanyNameSchema>;
export type Tags = z.infer<typeof TagsSchema>;
