#!/usr/bin/env node

// Export for programmatic use
export { setupIntelliSense } from './setup-intellisense';
export type { SetupOptions, ManifestType } from './setup-intellisense';

// CLI entry point
function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'setup-intellisense':
      // Remove the command from args and pass the rest
      process.argv = ['node', 'setup-intellisense', ...args.slice(1)];
      require('./setup-intellisense');
      break;

    case '--help':
    case '-h':
    case 'help':
      showHelp();
      break;

    default:
      if (!command) {
        showHelp();
      } else {
        console.error(`❌ Unknown command: ${command}`);
        console.log('Run "npx @codeiqlabs/aws-utils --help" for usage information.');
        process.exit(1);
      }
  }
}

function showHelp() {
  console.log(`
🔧 CodeIQLabs AWS Utils CLI

USAGE:
  npx @codeiqlabs/aws-utils <command> [options]

COMMANDS:
  setup-intellisense    Set up IntelliSense for manifest files
  help, --help, -h      Show this help message

SETUP INTELLISENSE OPTIONS:
  --manifest=<path>     Specific manifest file path
  --type=<type>         Force manifest type (management|workload|shared)
  --auto                Run in auto mode (less verbose output)
  --quiet               Suppress all output except errors

EXAMPLES:
  # Auto-detect and set up IntelliSense for all manifest files
  npx @codeiqlabs/aws-utils setup-intellisense

  # Set up for a specific manifest file
  npx @codeiqlabs/aws-utils setup-intellisense --manifest=src/manifest.yaml

  # Force a specific manifest type
  npx @codeiqlabs/aws-utils setup-intellisense --type=management

  # Run in quiet mode
  npx @codeiqlabs/aws-utils setup-intellisense --auto --quiet

For more information, visit: https://github.com/CodeIQLabs/codeiqlabs-aws-utils
`);
}

// Run CLI if this file is executed directly
const isMainModule =
  process.argv[1]?.endsWith('index.js') ||
  process.argv[1]?.endsWith('index.ts') ||
  process.argv[1]?.includes('cli');

if (isMainModule) {
  main();
}
