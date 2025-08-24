#!/usr/bin/env node
import { writeFileSync, existsSync, readFileSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';

export interface SetupOptions {
  manifestPath?: string;
  manifestType?: 'management' | 'workload' | 'shared';
  workspaceRoot?: string;
  auto?: boolean;
  verbose?: boolean;
}

export type ManifestType = 'management' | 'workload' | 'shared';

/**
 * Main function to set up IntelliSense for CodeIQLabs manifest files
 */
export function setupIntelliSense(options: SetupOptions = {}): void {
  const workspaceRoot = options.workspaceRoot || process.cwd();
  const verbose = options.verbose !== false; // Default to verbose unless explicitly disabled

  if (verbose) console.log('🔧 Setting up IntelliSense for CodeIQLabs manifests...');

  // Verify that @codeiqlabs/aws-utils is installed
  if (!validatePackageInstallation(workspaceRoot, verbose)) {
    return;
  }

  // Find manifest files if not specified
  const manifestFiles = options.manifestPath
    ? [options.manifestPath]
    : findManifestFiles(workspaceRoot);

  if (manifestFiles.length === 0) {
    if (!options.auto) {
      console.log('📝 No manifest files found. Create a manifest.yaml file first.');
      console.log('   Then run: npx @codeiqlabs/aws-utils setup-intellisense');
    }
    return;
  }

  // Process each manifest file
  manifestFiles.forEach((manifestPath) => {
    const fullPath = resolve(workspaceRoot, manifestPath);
    const manifestType = options.manifestType || detectManifestType(fullPath);

    if (verbose) {
      console.log(`📋 Processing ${manifestPath} (type: ${manifestType})`);
    }

    // Set up editor configurations
    setupVSCode(workspaceRoot, manifestType, manifestPath, verbose);
    setupIntelliJ(workspaceRoot, manifestType, manifestPath, verbose);
    addSchemaReference(fullPath, manifestType, verbose);
  });

  if (verbose) {
    console.log('✅ IntelliSense setup complete!');
    console.log('💡 Restart your editor to see the changes.');
  }
}

/**
 * Validate that @codeiqlabs/aws-utils package is installed
 */
function validatePackageInstallation(workspaceRoot: string, verbose: boolean): boolean {
  const packagePath = join(workspaceRoot, 'node_modules', '@codeiqlabs', 'aws-utils');
  const schemasPath = join(packagePath, 'schemas');

  if (!existsSync(packagePath)) {
    console.error('❌ @codeiqlabs/aws-utils package not found.');
    console.error('   Please install it first: npm install @codeiqlabs/aws-utils');
    return false;
  }

  if (!existsSync(schemasPath)) {
    console.error('❌ Schema files not found in @codeiqlabs/aws-utils package.');
    console.error(
      '   The package may be corrupted. Try reinstalling: npm install @codeiqlabs/aws-utils',
    );
    return false;
  }

  if (verbose) {
    console.log('✅ @codeiqlabs/aws-utils package found with schema files');
  }

  return true;
}

/**
 * Find common manifest file locations
 */
function findManifestFiles(workspaceRoot: string): string[] {
  const commonPaths = [
    'src/manifest.yaml',
    'src/config/manifest.yaml',
    'manifest.yaml',
    'config/manifest.yaml',
  ];

  return commonPaths.filter((path) => existsSync(join(workspaceRoot, path)));
}

/**
 * Detect manifest type based on file content
 */
function detectManifestType(manifestPath: string): ManifestType {
  if (!existsSync(manifestPath)) {
    return 'workload'; // Default fallback
  }

  try {
    const content = readFileSync(manifestPath, 'utf-8');

    // Check for management-specific sections
    if (content.includes('organization:') && content.includes('identityCenter:')) {
      return 'management';
    }

    // Check for shared services
    if (content.includes('sharedServices:')) {
      return 'shared';
    }

    // Default to workload
    return 'workload';
  } catch {
    console.warn(`⚠️  Could not read ${manifestPath}, defaulting to workload type`);
    return 'workload';
  }
}

/**
 * Set up VS Code configuration
 */
function setupVSCode(
  workspaceRoot: string,
  manifestType: ManifestType,
  manifestPath: string,
  verbose: boolean,
): void {
  const vscodeDir = join(workspaceRoot, '.vscode');
  const settingsPath = join(vscodeDir, 'settings.json');

  // Create .vscode directory if needed
  if (!existsSync(vscodeDir)) {
    mkdirSync(vscodeDir, { recursive: true });
  }

  // Read existing settings or create new
  let settings: any = {};
  if (existsSync(settingsPath)) {
    try {
      settings = JSON.parse(readFileSync(settingsPath, 'utf-8'));
    } catch {
      if (verbose) console.warn('⚠️  Could not parse existing VS Code settings, creating new');
    }
  }

  // Configure YAML schema with multiple strategies
  settings['yaml.schemas'] = settings['yaml.schemas'] || {};

  // Strategy 1: HTTP URL (most reliable)
  const httpSchemaUrl = `https://raw.githubusercontent.com/CodeIQLabs/codeiqlabs-aws-utils/main/schemas/${manifestType}-manifest.schema.json`;
  settings['yaml.schemas'][httpSchemaUrl] = [manifestPath, 'src/config/*.yaml', '**/manifest.yaml'];

  // Strategy 2: Local node_modules (fallback)
  const localSchemaPath = `./node_modules/@codeiqlabs/aws-utils/schemas/${manifestType}-manifest.schema.json`;
  settings['yaml.schemas'][localSchemaPath] = [
    manifestPath,
    'src/config/*.yaml',
    '**/manifest.yaml',
  ];

  // Enable YAML features
  Object.assign(settings, {
    'yaml.validate': true,
    'yaml.completion': true,
    'yaml.hover': true,
    'yaml.format.enable': true,
    'files.associations': {
      ...settings['files.associations'],
      '**/manifest.yaml': 'yaml',
      '**/config/**/*.yaml': 'yaml',
    },
  });

  writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
  if (verbose) console.log('✅ VS Code settings updated');
}

/**
 * Set up IntelliJ IDEA configuration
 */
function setupIntelliJ(
  workspaceRoot: string,
  manifestType: ManifestType,
  manifestPath: string,
  verbose: boolean,
): void {
  const ideaDir = join(workspaceRoot, '.idea');
  const jsonSchemasPath = join(ideaDir, 'jsonSchemas.xml');

  // Create .idea directory if needed
  if (!existsSync(ideaDir)) {
    mkdirSync(ideaDir, { recursive: true });
  }

  // Read existing configuration or create new
  let existingConfig = '';
  if (existsSync(jsonSchemasPath)) {
    existingConfig = readFileSync(jsonSchemasPath, 'utf-8');
  }

  // Use HTTP URL for better IntelliJ compatibility
  const schemaUrl = `https://raw.githubusercontent.com/CodeIQLabs/codeiqlabs-aws-utils/main/schemas/${manifestType}-manifest.schema.json`;
  const schemaName = `CodeIQLabs ${manifestType.charAt(0).toUpperCase() + manifestType.slice(1)} Manifest`;

  // Check if schema is already configured
  if (existingConfig.includes(schemaName)) {
    if (verbose) console.log('📋 IntelliJ schema already configured');
    return;
  }

  // Generate IntelliJ configuration
  const schemaConfig = generateIntelliJConfig(schemaName, schemaUrl, manifestPath);

  if (
    existingConfig &&
    existingConfig.includes('<component name="JsonSchemaMappingsProjectConfiguration">')
  ) {
    // Insert into existing configuration
    const insertPoint = existingConfig.indexOf('</component>');
    const updatedConfig =
      existingConfig.slice(0, insertPoint) +
      schemaConfig.schemaEntry +
      '\n    ' +
      existingConfig.slice(insertPoint);
    writeFileSync(jsonSchemasPath, updatedConfig);
  } else {
    // Create new configuration
    writeFileSync(jsonSchemasPath, schemaConfig.fullConfig);
  }

  if (verbose) console.log('✅ IntelliJ IDEA settings updated');
}

/**
 * Generate IntelliJ IDEA JSON Schema configuration
 */
function generateIntelliJConfig(schemaName: string, schemaUrl: string, manifestPath: string) {
  const schemaEntry = `    <entry key="${schemaName}">
      <value>
        <SchemaInfo>
          <option name="name" value="${schemaName}" />
          <option name="relativePathToSchema" value="${schemaUrl}" />
          <option name="applicationDefined" value="true" />
          <option name="patterns">
            <list>
              <Item>
                <option name="path" value="${manifestPath}" />
              </Item>
            </list>
          </option>
        </SchemaInfo>
      </value>
    </entry>`;

  const fullConfig = `<?xml version="1.0" encoding="UTF-8"?>
<project version="4">
  <component name="JsonSchemaMappingsProjectConfiguration">
${schemaEntry}
  </component>
</project>`;

  return { schemaEntry, fullConfig };
}

/**
 * Get the best schema reference for the given manifest type
 */
function getSchemaReference(
  _workspaceRoot: string,
  manifestType: ManifestType,
  _manifestPath: string,
): string {
  // Strategy 1: Try HTTP URL (most reliable for IntelliJ)
  const httpUrl = `https://raw.githubusercontent.com/CodeIQLabs/codeiqlabs-aws-utils/main/schemas/${manifestType}-manifest.schema.json`;

  // TODO: Future strategies for offline support
  // Strategy 2: Try absolute path to node_modules
  // const absolutePath = join(workspaceRoot, 'node_modules', '@codeiqlabs', 'aws-utils', 'schemas', `${manifestType}-manifest.schema.json`);

  // Strategy 3: Try relative path from manifest location
  // const manifestDir = join(workspaceRoot, manifestPath.split('/').slice(0, -1).join('/'));
  // const relativePath = join(manifestDir, '..', 'node_modules', '@codeiqlabs', 'aws-utils', 'schemas', `${manifestType}-manifest.schema.json`);

  // For now, prefer HTTP URL as it's most reliable
  return httpUrl;
}

/**
 * Add schema reference to YAML file for both editors
 */
function addSchemaReference(
  manifestPath: string,
  manifestType: ManifestType,
  verbose: boolean,
): void {
  if (!existsSync(manifestPath)) {
    if (verbose) console.warn(`⚠️  Manifest file not found: ${manifestPath}`);
    return;
  }

  const content = readFileSync(manifestPath, 'utf-8');
  const workspaceRoot = process.cwd();
  const schemaUrl = getSchemaReference(workspaceRoot, manifestType, manifestPath);
  const schemaComment = `# yaml-language-server: $schema=${schemaUrl}\n\n`;

  // Check if schema reference already exists
  if (content.includes('yaml-language-server: $schema=')) {
    if (verbose) console.log('📋 Schema reference already exists in manifest');
    return;
  }

  // Add schema reference at the top
  const updatedContent = schemaComment + content;
  writeFileSync(manifestPath, updatedContent);
  if (verbose) console.log('✅ Schema reference added to manifest');
}

// CLI interface - check if this file is being run directly
const isMainModule =
  process.argv[1]?.endsWith('setup-intellisense.js') ||
  process.argv[1]?.endsWith('setup-intellisense.ts') ||
  process.argv[1]?.includes('setup-intellisense');

if (isMainModule) {
  const args = process.argv.slice(2);

  const options: SetupOptions = {
    manifestPath: args.find((arg) => arg.startsWith('--manifest='))?.split('=')[1],
    manifestType: args.find((arg) => arg.startsWith('--type='))?.split('=')[1] as ManifestType,
    auto: args.includes('--auto'),
    verbose: !args.includes('--auto') && !args.includes('--quiet'),
  };

  setupIntelliSense(options);
}
