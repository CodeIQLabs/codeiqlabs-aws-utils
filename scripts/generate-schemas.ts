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
 * Generate JSON schema shims that reference the unified schema
 */
function generateSchemas() {
  console.log('🔧 Generating JSON schema shims for CodeIQLabs manifest types...');

  // Create schemas directory
  const schemasDir = join(__dirname, '..', 'schemas');
  mkdirSync(schemasDir, { recursive: true });

  // Map schema names to their unified schema definitions
  const defMap: Record<string, string> = {
    'management-manifest': 'ManagementManifest',
    'workload-manifest': 'WorkloadManifest',
    'shared-services-manifest': 'SharedServicesManifest',
    'baseline-manifest': 'BaselineManifest',
  };

  for (const { name, title, description } of schemas) {
    console.log(`📋 Generating ${name}.schema.json shim...`);

    try {
      const shimSchema = {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        $id: `https://raw.githubusercontent.com/CodeIQLabs/codeiqlabs-aws-utils/main/schemas/${name}.schema.json`,
        title: title,
        description: description,
        $ref: `https://schemas.codeiqlabs.dev/aws/manifest.schema.json#/$defs/${defMap[name]}`,
      };

      // Write schema shim file
      const filePath = join(schemasDir, `${name}.schema.json`);
      writeFileSync(filePath, JSON.stringify(shimSchema, null, 2));

      console.log(`✅ Generated ${filePath} shim`);
    } catch (error) {
      console.error(`❌ Failed to generate shim for ${name}:`, error);
      process.exit(1);
    }
  }

  console.log('\n🎉 All JSON schema shims generated successfully!');
  console.log('\n📁 Generated shim files:');
  schemas.forEach(({ name }) => {
    console.log(`   schemas/${name}.schema.json`);
  });

  console.log(
    '\n📝 Note: The unified schema is maintained manually in schemas/manifest.schema.json',
  );
  console.log('\n🔗 Schema URLs for YAML language server:');
  schemas.forEach(({ name, title }) => {
    console.log(`   ${title}:`);
    console.log(
      `   https://raw.githubusercontent.com/CodeIQLabs/codeiqlabs-aws-utils/main/schemas/${name}.schema.json`,
    );
    console.log('');
  });
}

// Run the script
generateSchemas();
