#!/usr/bin/env node
import { zodToJsonSchema } from 'zod-to-json-schema';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { ManifestSchema } from './index';

/**
 * Generate JSON Schema files for the unified manifest schema
 */
export function generateJsonSchemas(): void {
  console.log('Generating unified JSON Schema...');

  // Create schemas directory
  const schemasDir = join(process.cwd(), 'schemas');
  if (!existsSync(schemasDir)) {
    mkdirSync(schemasDir, { recursive: true });
  }

  // Generate unified schema
  generateUnifiedSchema(schemasDir);

  console.log('🎉 Unified JSON Schema generation complete!');
}

/**
 * Generate unified schema from the UnifiedAppConfigSchema
 */
function generateUnifiedSchema(schemasDir: string): void {
  console.log('📋 Generating unified manifest schema...');

  try {
    // Generate unified schema from Zod schema
    const unifiedSchema = zodToJsonSchema(ManifestSchema, {
      name: 'CodeIQLabsAwsManifest',
      basePath: ['$defs'], // Place shared components under $defs
      $refStrategy: 'relative', // Encourage $ref usage for reusability
      target: 'jsonSchema7', // Use JSON Schema draft-07 for compatibility
      definitions: {}, // Allow for shared definitions
      errorMessages: false, // Clean output without error messages
    }) as Record<string, unknown>;

    // Enhance the generated schema with proper metadata and optimized primitives
    const enhancedSchema = {
      $id: 'https://schemas.codeiqlabs.dev/aws/manifest.schema.json',
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      title: 'CodeIQLabs AWS Manifest (Unified)',
      description:
        'Unified schema for CodeIQLabs AWS manifest files. Supports component-based configuration where any component can be deployed to any account. No manifestType field - components define what gets deployed.',
      ...unifiedSchema,
      $defs: {
        ...createOptimizedPrimitives(),
        ...((unifiedSchema.$defs as Record<string, unknown>) || {}),
      },
      // Strict validation at root level
      unevaluatedProperties: false,
    };

    // Apply strict validation enhancements
    const optimizedSchema = applyStrictValidationRules(enhancedSchema);

    // Write optimized unified schema
    const unifiedPath = join(schemasDir, 'manifest.schema.json');
    writeFileSync(unifiedPath, JSON.stringify(optimizedSchema, null, 2));

    console.log('✅ Generated unified manifest.schema.json');
  } catch (error) {
    console.error('❌ Failed to generate unified schema:', error);
    throw error;
  }
}

/**
 * Create optimized primitive definitions with enhanced error messages and strict validation
 */
function createOptimizedPrimitives(): Record<string, any> {
  return {
    // AWS Resource Identifiers
    AwsAccountId: {
      type: 'string',
      pattern: '^\\d{12}$',
      description: 'AWS Account ID - exactly 12 digits',
      errorMessage: {
        pattern: 'AWS Account ID must be exactly 12 digits (e.g., "123456789012")',
      },
    },
    AwsRegion: {
      type: 'string',
      pattern: '^[a-z]{2}-[a-z]+-\\d{1,2}$',
      description: 'AWS Region identifier (e.g., us-east-1, eu-west-2)',
      errorMessage: {
        pattern:
          'AWS Region must follow the format: {region}-{location}-{number} (e.g., "us-east-1")',
      },
    },
    AwsArn: {
      type: 'string',
      pattern: '^arn:aws:[a-zA-Z0-9-]+:[a-z0-9-]*:\\d{12}:[a-zA-Z0-9-_/:.]+$',
      description: 'AWS ARN (Amazon Resource Name)',
      errorMessage: {
        pattern: 'AWS ARN must follow the format: arn:aws:service:region:account-id:resource',
      },
    },

    // Project and Environment Identifiers
    ProjectName: {
      type: 'string',
      minLength: 2,
      maxLength: 63,
      pattern: '^[a-z][a-z0-9-]*[a-z0-9]$',
      description: 'Project name - lowercase, alphanumeric with hyphens, 2-63 characters',
      errorMessage: {
        minLength: 'Project name must be at least 2 characters long',
        maxLength: 'Project name must be no more than 63 characters long',
        pattern:
          'Project name must start with a letter, contain only lowercase letters, numbers, and hyphens, and end with a letter or number',
      },
    },
    EnvCode: {
      enum: ['mgmt', 'shrd', 'nprd', 'pprd', 'prod'],
      description: 'Environment code - standardized environment identifier',
      errorMessage: {
        enum: 'Environment code must be one of: mgmt (management), shrd (shared), nprd (non-production), pprd (pre-production), prod (production)',
      },
    },

    // Contact and Organizational Information
    EmailAddress: {
      type: 'string',
      format: 'email',
      maxLength: 254,
      description: 'Valid email address',
      errorMessage: {
        format: 'Must be a valid email address (e.g., "user@example.com")',
        maxLength: 'Email address must be no more than 254 characters long',
      },
    },
    CompanyName: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
      pattern: '^[\\w\\s&.-]+$',
      description: 'Company or organization name',
      errorMessage: {
        minLength: 'Company name is required',
        maxLength: 'Company name must be no more than 100 characters long',
        pattern: 'Company name can contain letters, numbers, spaces, and common punctuation (&.-)',
      },
    },

    // AWS Resource Properties
    TagMap: {
      type: 'object',
      patternProperties: {
        '^[a-zA-Z0-9+\\-=._:/@]+$': {
          type: 'string',
          maxLength: 256,
        },
      },
      additionalProperties: false,
      description: 'AWS resource tags - key-value pairs for resource organization',
      errorMessage: {
        additionalProperties:
          'Tag keys must match AWS tag key requirements (letters, numbers, and +\\-=._:/@)',
      },
    },
    VpcCidr: {
      type: 'string',
      pattern:
        '^(10\\.(\\d{1,3})\\.(\\d{1,3})\\.(\\d{1,3})/(1[6-9]|2[0-8]))|(172\\.(1[6-9]|2\\d|3[01])\\.(\\d{1,3})\\.(\\d{1,3})/(1[6-9]|2[0-8]))|(192\\.168\\.(\\d{1,3})\\.(\\d{1,3})/(1[6-9]|2[0-8]))$',
      description: 'VPC CIDR block - private IP range for the VPC',
      errorMessage: {
        pattern:
          'VPC CIDR must be a valid private IP range (10.0.0.0/16-28, 172.16.0.0/16-28, or 192.168.0.0/16-28)',
      },
    },

    // Base Manifest Schema
    BaseManifest: {
      type: 'object',
      properties: {
        project: { $ref: '#/$defs/ProjectName' },
        company: { $ref: '#/$defs/CompanyName' },
      },
      required: ['project', 'company'],
      additionalProperties: false,
      description: 'Base properties required for all manifest types',
      errorMessage: {
        required: 'All manifests must include project and company properties',
        additionalProperties:
          'Base manifest cannot contain additional properties beyond project and company',
      },
    },
  };
}

/**
 * Apply strict validation rules and enhanced error messages to the schema
 */
function applyStrictValidationRules(schema: any): any {
  // Deep clone to avoid mutations
  const optimizedSchema = JSON.parse(JSON.stringify(schema));

  // Recursively apply strict validation rules
  function enhanceSchemaNode(node: any, path: string[] = []): void {
    if (!node || typeof node !== 'object') return;

    // Add strict validation to object schemas
    if (node.type === 'object' && node.properties) {
      // Ensure additionalProperties is explicitly set to false for strict validation
      if (node.additionalProperties === undefined) {
        node.additionalProperties = false;
      }

      // Add enhanced error messages for required properties
      if (node.required && Array.isArray(node.required)) {
        node.errorMessage = {
          ...node.errorMessage,
          required: {
            ...node.errorMessage?.required,
            ...Object.fromEntries(
              node.required.map((prop: string) => [prop, `Missing required property: ${prop}`]),
            ),
          },
        };
      }

      // Recursively enhance nested properties
      Object.keys(node.properties).forEach((prop) => {
        enhanceSchemaNode(node.properties[prop], [...path, prop]);
      });
    }

    // Enhance array schemas
    if (node.type === 'array' && node.items) {
      enhanceSchemaNode(node.items, [...path, 'items']);
    }

    // Enhance oneOf/anyOf schemas (discriminated unions)
    if (node.oneOf && Array.isArray(node.oneOf)) {
      node.oneOf.forEach((variant: any, index: number) => {
        enhanceSchemaNode(variant, [...path, 'oneOf', index.toString()]);
      });
    }

    if (node.anyOf && Array.isArray(node.anyOf)) {
      node.anyOf.forEach((variant: any, index: number) => {
        enhanceSchemaNode(variant, [...path, 'anyOf', index.toString()]);
      });
    }

    // Enhance definitions
    if (node.$defs) {
      Object.keys(node.$defs).forEach((defKey) => {
        enhanceSchemaNode(node.$defs[defKey], [...path, '$defs', defKey]);
      });
    }

    if (node.definitions) {
      Object.keys(node.definitions).forEach((defKey) => {
        enhanceSchemaNode(node.definitions[defKey], [...path, 'definitions', defKey]);
      });
    }
  }

  // Apply enhancements starting from root
  enhanceSchemaNode(optimizedSchema);

  return optimizedSchema;
}

// CLI execution - always run when this file is executed directly
generateJsonSchemas();
