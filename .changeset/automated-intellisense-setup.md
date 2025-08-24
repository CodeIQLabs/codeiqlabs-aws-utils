---
"@codeiqlabs/aws-utils": minor
---

feat: Add automated IntelliSense setup for manifest files

This release introduces a comprehensive automated IntelliSense setup system that provides seamless autocomplete, validation, and hover documentation for CodeIQLabs manifest files in both VS Code and IntelliJ IDEA.

## New Features

### 🔧 CLI Tool for IntelliSense Setup
- Added `npx @codeiqlabs/aws-utils setup-intellisense` command
- Auto-detects manifest types (management/workload/shared)
- Configures both VS Code and IntelliJ IDEA automatically
- Cross-platform compatibility (Windows, macOS, Linux)

### 📋 JSON Schema Generation
- Automated generation of JSON Schema files from Zod schemas
- HTTP-based schema distribution for reliable cross-editor support
- Real-time validation and error reporting
- Contextual autocomplete suggestions

### 🎯 Enhanced Schema Structure
- Fixed schema hierarchy to match actual YAML structure
- Properties now appear in correct contextual locations
- Improved validation with detailed error messages
- Support for nested property autocomplete

### 🌐 HTTP Schema Distribution
- Schemas hosted via GitHub raw URLs for universal access
- Eliminates local file path resolution issues
- Always up-to-date schemas without manual updates
- Works reliably across all IDEs and environments

## Developer Experience Improvements

- **Zero Setup**: Install package + run CLI = IntelliSense works
- **No File Copying**: Schemas referenced directly from package
- **Clean Projects**: No schema files cluttering repositories
- **Automatic Updates**: Latest schemas always available
- **Universal Compatibility**: Works in any environment with internet access

## Breaking Changes

None. This is a purely additive feature that enhances the existing manifest system.

## Usage

```bash
# Install the package
npm install @codeiqlabs/aws-utils

# Set up IntelliSense
npx @codeiqlabs/aws-utils setup-intellisense

# Restart your editor and enjoy full IntelliSense support!
```

## Technical Details

- Added CLI infrastructure with TypeScript support
- Enhanced build system with dual ESM/CJS output
- Improved schema validation with contextual error messages
- HTTP-based schema distribution for maximum compatibility
- Support for multiple manifest types with auto-detection
