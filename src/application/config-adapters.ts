/**
 * Configuration Adapters for CDK Applications
 *
 * This module provides utilities for transforming manifest configurations
 * into the specific configuration formats required by different CDK constructs
 * and stack classes.
 */

import type {
  ManagementAppConfig,
  WorkloadAppConfig,
  SharedServicesAppConfig,
  BaselineAppConfig,
} from '../config';
import type { NamingConfig } from '../naming/types';

/**
 * Configuration for management account base stacks
 */
export interface ManagementBaseStackConfig {
  project: string;
  environment: string;
  region: string;
  accountId: string;
  owner: string;
  company: string;
}

/**
 * Configuration for workload account base stacks
 */
export interface WorkloadBaseStackConfig {
  project: string;
  environment: string;
  region: string;
  accountId: string;
  owner: string;
  company: string;
}

/**
 * Configuration for shared services account base stacks
 */
export interface SharedServicesBaseStackConfig {
  project: string;
  environment: string;
  region: string;
  accountId: string;
  owner: string;
  company: string;
}

/**
 * Configuration adapter utilities for transforming manifest configurations
 * into stack-specific configuration formats
 */
export class ManifestConfigAdapter {
  /**
   * Transform management manifest to management base stack configuration
   *
   * @param manifest - The management manifest configuration
   * @returns Management base stack configuration
   */
  static toManagementConfig(manifest: ManagementAppConfig): ManagementBaseStackConfig {
    return {
      project: manifest.project,
      environment: manifest.management.environment,
      region: manifest.management.region,
      accountId: manifest.management.accountId,
      owner: manifest.company, // Use company as owner for management account
      company: manifest.company,
    };
  }

  /**
   * Transform workload manifest to workload base stack configuration
   *
   * @param manifest - The workload manifest configuration
   * @param envName - The environment name (e.g., 'np', 'prod')
   * @returns Workload base stack configuration
   */
  static toWorkloadConfig(manifest: WorkloadAppConfig, envName: string): WorkloadBaseStackConfig {
    const environment = manifest.environments[envName];
    if (!environment) {
      throw new Error(
        `Environment '${envName}' not found in workload manifest. ` +
          `Available environments: ${Object.keys(manifest.environments).join(', ')}`,
      );
    }

    return {
      project: manifest.project,
      environment: envName,
      region: environment.region,
      accountId: environment.accountId,
      owner: manifest.company, // Use company as owner
      company: manifest.company,
    };
  }

  /**
   * Transform shared services manifest to shared services base stack configuration
   *
   * @param manifest - The shared services manifest configuration
   * @returns Shared services base stack configuration
   */
  static toSharedServicesConfig(manifest: SharedServicesAppConfig): SharedServicesBaseStackConfig {
    // SharedServices manifests use the management account reference for deployment
    return {
      project: manifest.project,
      environment: manifest.management.environment,
      region: manifest.management.region,
      accountId: manifest.management.accountId,
      owner: manifest.company,
      company: manifest.company,
    };
  }

  /**
   * Transform baseline manifest to workload base stack configuration
   *
   * @param manifest - The baseline manifest configuration
   * @returns Workload base stack configuration (baseline uses workload patterns)
   */
  static toBaselineConfig(manifest: BaselineAppConfig): WorkloadBaseStackConfig {
    // Baseline manifests use the management account reference for deployment
    return {
      project: manifest.project,
      environment: manifest.management.environment,
      region: manifest.management.region,
      accountId: manifest.management.accountId,
      owner: manifest.company,
      company: manifest.company,
    };
  }

  /**
   * Transform any manifest configuration to naming configuration
   *
   * @param manifest - Any manifest configuration
   * @param envName - Optional environment name (required for workload/baseline manifests)
   * @returns Naming configuration
   */
  static toNamingConfig(
    manifest: ManagementAppConfig | WorkloadAppConfig | SharedServicesAppConfig | BaselineAppConfig,
    envName?: string,
  ): NamingConfig {
    switch (manifest.type) {
      case 'management':
        return {
          project: manifest.project,
          environment: manifest.management.environment,
          region: manifest.management.region,
          accountId: manifest.management.accountId,
        };

      case 'workload': {
        if (!envName) {
          throw new Error('Environment name is required for workload manifest');
        }
        const workloadEnv = manifest.environments[envName];
        if (!workloadEnv) {
          throw new Error(`Environment '${envName}' not found in workload manifest`);
        }
        return {
          project: manifest.project,
          environment: envName,
          region: workloadEnv.region,
          accountId: workloadEnv.accountId,
        };
      }

      case 'shared-services':
        return {
          project: manifest.project,
          environment: manifest.management.environment,
          region: manifest.management.region,
          accountId: manifest.management.accountId,
        };

      case 'baseline':
        return {
          project: manifest.project,
          environment: manifest.management.environment,
          region: manifest.management.region,
          accountId: manifest.management.accountId,
        };

      default:
        throw new Error(`Unsupported manifest type: ${(manifest as any).type}`);
    }
  }

  /**
   * Extract all environment configurations from a manifest
   *
   * @param manifest - Any manifest configuration
   * @returns Array of environment configurations with names
   */
  static extractEnvironments(
    manifest: ManagementAppConfig | WorkloadAppConfig | SharedServicesAppConfig | BaselineAppConfig,
  ): Array<{ name: string; config: WorkloadBaseStackConfig | SharedServicesBaseStackConfig }> {
    switch (manifest.type) {
      case 'management':
        return [
          {
            name: manifest.management.environment,
            config: this.toManagementConfig(manifest),
          },
        ];

      case 'workload':
        return Object.keys(manifest.environments).map((envName) => ({
          name: envName,
          config: this.toWorkloadConfig(manifest, envName),
        }));

      case 'shared-services':
        return [
          {
            name: manifest.management.environment,
            config: this.toSharedServicesConfig(manifest),
          },
        ];

      case 'baseline':
        return [
          {
            name: manifest.management.environment,
            config: this.toBaselineConfig(manifest),
          },
        ];

      default:
        throw new Error(`Unsupported manifest type: ${(manifest as any).type}`);
    }
  }
}
