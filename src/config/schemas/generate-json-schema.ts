#!/usr/bin/env node
import { zodToJsonSchema } from 'zod-to-json-schema';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { ManagementAppConfigSchema, WorkloadAppConfigSchema } from './applications/index';

interface SchemaDefinition {
  name: string;
  schema: any;
  filename: string;
  description: string;
}

/**
 * Generate JSON Schema files from Zod schemas for IntelliSense support
 */
export function generateJsonSchemas(): void {
  console.log('🔧 Generating JSON Schema files for IntelliSense...');

  // Define all schemas to generate
  const schemas: SchemaDefinition[] = [
    {
      name: 'ManagementAppConfig',
      schema: ManagementAppConfigSchema,
      filename: 'management-manifest',
      description: 'Schema for CodeIQLabs management account manifest files',
    },
    {
      name: 'WorkloadAppConfig',
      schema: WorkloadAppConfigSchema,
      filename: 'workload-manifest',
      description: 'Schema for CodeIQLabs workload account manifest files',
    },
  ];

  // Create schemas directory
  const schemasDir = join(process.cwd(), 'schemas');
  if (!existsSync(schemasDir)) {
    mkdirSync(schemasDir, { recursive: true });
  }

  // Generate individual schemas
  schemas.forEach(({ name, schema, filename, description }) => {
    try {
      const jsonSchema = zodToJsonSchema(schema, {
        name,
        $refStrategy: 'none', // Inline all references for better IntelliSense
        definitions: {},
        errorMessages: true,
      });

      // Add metadata for better editor support
      jsonSchema.title = name;
      jsonSchema.description = description;
      jsonSchema.$id = `https://raw.githubusercontent.com/CodeIQLabs/codeiqlabs-aws-utils/main/schemas/${filename}.schema.json`;

      const outputPath = join(schemasDir, `${filename}.schema.json`);
      writeFileSync(outputPath, JSON.stringify(jsonSchema, null, 2));

      console.log(`✅ Generated ${filename}.schema.json`);
    } catch (error) {
      console.error(`❌ Failed to generate schema for ${name}:`, error);
    }
  });

  // Generate union schema for auto-detection
  generateUnionSchema(schemas, schemasDir);

  console.log('🎉 JSON Schema generation complete!');
}

/**
 * Generate a union schema that can auto-detect manifest type
 */
function generateUnionSchema(schemas: SchemaDefinition[], schemasDir: string): void {
  const unionSchema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'https://schemas.codeiqlabs.com/manifest.json',
    title: 'CodeIQLabs Manifest',
    description: 'Auto-detecting schema for CodeIQLabs manifest files',
    type: 'object',
    oneOf: schemas.map(({ filename, description }) => ({
      $ref: `./${filename}.schema.json`,
      description: description,
    })),
  };

  const unionPath = join(schemasDir, 'manifest.schema.json');
  writeFileSync(unionPath, JSON.stringify(unionSchema, null, 2));
  console.log('✅ Generated union manifest.schema.json');
}

// CLI execution - always run when this file is executed directly
generateJsonSchemas();
