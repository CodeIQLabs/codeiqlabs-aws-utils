#!/usr/bin/env ts-node

/**
 * Generate JSON schemas from Zod schemas for all application types
 *
 * This script generates JSON Schema files that can be used for:
 * - IDE validation and autocomplete
 * - Language server integration
 * - External validation tools
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { zodToJsonSchema } from 'zod-to-json-schema';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import {
  ManagementAppConfigSchema,
  BaselineAppConfigSchema,
  WorkloadAppConfigSchema,
  SharedServicesAppConfigSchema,
} from '../src/config/schemas/applications';

/**
 * Schema definitions with metadata
 */
const schemas = [
  {
    name: 'management-manifest',
    schema: ManagementAppConfigSchema,
    title: 'CodeIQLabs Management Manifest',
    description: 'Schema for CodeIQLabs AWS management account configuration manifests',
  },
  {
    name: 'baseline-manifest',
    schema: BaselineAppConfigSchema,
    title: 'CodeIQLabs Baseline Manifest',
    description: 'Schema for CodeIQLabs AWS baseline account configuration manifests',
  },
  {
    name: 'workload-manifest',
    schema: WorkloadAppConfigSchema,
    title: 'CodeIQLabs Workload Manifest',
    description: 'Schema for CodeIQLabs AWS workload account configuration manifests',
  },
  {
    name: 'shared-services-manifest',
    schema: SharedServicesAppConfigSchema,
    title: 'CodeIQLabs Shared Services Manifest',
    description: 'Schema for CodeIQLabs AWS shared services account configuration manifests',
  },
];

/**
 * Generate JSON schemas
 */
function generateSchemas() {
  console.log('🔧 Generating JSON schemas for CodeIQLabs manifest types...');

  // Create schemas directory
  const schemasDir = join(__dirname, '..', 'schemas');
  mkdirSync(schemasDir, { recursive: true });

  for (const { name, schema, title, description } of schemas) {
    console.log(`📋 Generating ${name}.schema.json...`);

    try {
      // Generate JSON schema
      const jsonSchema = zodToJsonSchema(schema, {
        name: title,
        description,
        $refStrategy: 'none', // Inline all references for better IDE support
      });

      // Add additional metadata
      const enhancedSchema = {
        ...jsonSchema,
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: `https://raw.githubusercontent.com/CodeIQLabs/codeiqlabs-aws-utils/main/schemas/${name}.schema.json`,
        title,
        description,
        examples: getExampleForSchema(name),
      };

      // Write to file
      const filePath = join(schemasDir, `${name}.schema.json`);
      writeFileSync(filePath, JSON.stringify(enhancedSchema, null, 2));

      console.log(`✅ Generated ${filePath}`);
    } catch (error) {
      console.error(`❌ Failed to generate ${name}.schema.json:`, error);
      process.exit(1);
    }
  }

  console.log('\n🎉 All JSON schemas generated successfully!');
  console.log('\n📁 Generated files:');
  schemas.forEach(({ name }) => {
    console.log(`   schemas/${name}.schema.json`);
  });

  console.log('\n🔗 Schema URLs for YAML language server:');
  schemas.forEach(({ name, title }) => {
    console.log(`   ${title}:`);
    console.log(
      `   https://raw.githubusercontent.com/CodeIQLabs/codeiqlabs-aws-utils/main/schemas/${name}.schema.json`,
    );
    console.log('');
  });
}

/**
 * Get example manifest for each schema type
 */
function getExampleForSchema(schemaName: string): any[] {
  const baseExample = {
    project: 'MyProject',
    company: 'MyOrganization',
    management: {
      accountId: '${MANAGEMENT_ACCOUNT_ID}',
      region: 'us-east-1',
      environment: 'mgmt',
    },
  };

  switch (schemaName) {
    case 'management-manifest':
      return [
        {
          ...baseExample,
          type: 'management',
          organization: {
            enabled: true,
            rootId: '${ORG_ROOT_ID}',
            mode: 'adopt',
          },
          identityCenter: {
            enabled: true,
            instanceArn: '${SSO_INSTANCE_ARN}',
          },
        },
      ];

    case 'baseline-manifest':
      return [
        {
          ...baseExample,
          type: 'baseline',
          networking: {
            mode: 'create',
            vpc: {
              name: 'main-vpc',
              cidr: '10.0.0.0/16',
              region: 'us-east-1',
            },
          },
        },
      ];

    case 'workload-manifest':
      return [
        {
          ...baseExample,
          type: 'workload',
          environments: {
            nprd: {
              accountId: '${NPRD_ACCOUNT_ID}',
              region: 'us-east-1',
              environment: 'nprd',
            },
            prod: {
              accountId: '${PROD_ACCOUNT_ID}',
              region: 'us-east-1',
              environment: 'prod',
            },
          },
        },
      ];

    case 'shared-services-manifest':
      return [
        {
          ...baseExample,
          type: 'shared-services',
          sharedServices: {
            services: {
              monitoring: {
                enabled: true,
              },
            },
          },
        },
      ];

    default:
      return [baseExample];
  }
}

// Run the script
generateSchemas();
