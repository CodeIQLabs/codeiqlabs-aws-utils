/**
 * Convenience functions for common AWS resource naming patterns
 *
 * This module intentionally contains only generic, project-agnostic utilities.
 * Project-specific convenience classes live in separate files under ./projects.
 */

import type { NamingConfig, TaggingOptions } from './types';
import {
  generateStackName,
  generateExportName,
  generateResourceName,
  generateS3BucketName,
  generateDomainName,
  generateIAMRoleName,
} from './functions';

// Import tagging from tagging module - this creates a dependency on tagging utilities
// but keeps the convenience class in the naming module for better organization
import { generateStandardTags, type CodeIQLabsStandardTags } from '../tagging/functions';

/**
 * Creates a naming utility instance for a specific project and environment
 * This provides a convenient way to generate multiple resource names with consistent configuration
 */
export class ResourceNaming {
  private config: NamingConfig;

  constructor(config: NamingConfig) {
    this.config = config;
  }

  /**
   * Generate a CDK stack name with readable environment names
   * Uses display names like 'NonProd', 'Prod', 'Management', 'Shared', 'PreProd'
   */
  stackName(component: string): string {
    return generateStackName(this.config, component);
  }

  /**
   * Generate a CloudFormation export name
   */
  exportName(resourceName: string): string {
    return generateExportName(this.config, resourceName);
  }

  /**
   * Generate a resource name
   */
  resourceName(name: string): string {
    return generateResourceName(this.config, name);
  }

  /**
   * Generate an IAM role name
   */
  iamRoleName(roleName: string): string {
    return generateIAMRoleName(this.config, roleName);
  }

  /**
   * Generate an S3 bucket name with stable suffix for global uniqueness
   */
  s3BucketName(purpose: string, includeStableSuffix = true): string {
    return generateS3BucketName(this.config, { purpose, includeStableSuffix });
  }

  /**
   * Generate a domain name
   */
  domainName(baseDomain: string, subdomain?: string): string {
    return generateDomainName(this.config, baseDomain, subdomain);
  }

  /**
   * Generate an SSM parameter name following standard naming conventions
   *
   * Pattern: /{company}/{project}/{environment}/{category}/{name}
   * All segments are lowercase for consistency.
   *
   * @param category - Logical grouping (e.g., 'frontend', 'api', 'webapp')
   * @param name - Parameter name (e.g., 'alb-dns', 'bucket-name')
   * @returns SSM parameter path
   *
   * @example
   * // With company: 'AcmeCorp', project: 'MyApp', environment: 'nprd'
   * naming.ssmParameterName('frontend', 'alb-dns')
   * // Returns: '/acmecorp/myapp/nprd/frontend/alb-dns'
   *
   * @example
   * // With nested category for brand-specific parameters
   * naming.ssmParameterName('webapp/brand-a', 'bucket-name')
   * // Returns: '/acmecorp/myapp/nprd/webapp/brand-a/bucket-name'
   */
  ssmParameterName(category: string, name: string): string {
    // Company is required by schema validation, but TypeScript type allows optional
    // Throw a clear error if company is not provided
    if (!this.config.company) {
      throw new Error(
        'Company is required for SSM parameter naming. Ensure company is set in naming config.',
      );
    }
    const company = this.config.company.toLowerCase();
    const project = this.config.project.toLowerCase();
    const environment = this.config.environment.toLowerCase();
    return `/${company}/${project}/${environment}/${category}/${name}`;
  }

  /**
   * Generate standard tags
   */
  standardTags(options: TaggingOptions = {}): CodeIQLabsStandardTags {
    return generateStandardTags(this.config, options);
  }

  /**
   * Get the current configuration
   */
  getConfig(): NamingConfig {
    return { ...this.config };
  }
}
