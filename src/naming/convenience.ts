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
   * Generate an SSM parameter name following CodeIQLabs naming conventions
   * Pattern: /{project}/{environment}/{category}/{name}
   * Example: /CodeIQLabs/Management/accounts/budgettrack-nprd-id
   */
  ssmParameterName(category: string, name: string): string {
    return `/${this.config.project}/${this.config.environment}/${category}/${name}`;
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
