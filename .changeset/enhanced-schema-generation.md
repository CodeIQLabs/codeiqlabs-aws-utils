---
'@codeiqlabs/aws-utils': minor
---

# Enhanced Unified Schema Generation with Discriminated Unions

This release introduces a comprehensive overhaul of the schema generation system, implementing
enhanced unified schema generation with discriminated unions, JSON Schema optimizations, and a
robust TypeScript type generation strategy.

## 🎯 Major Features

### Enhanced Unified Schema Generation

- **Discriminated Union Architecture**: Implemented `ManifestSchema` using
  `z.discriminatedUnion('type', [...])` for automatic type detection and validation
- **zod-to-json-schema Integration**: Leverages built-in composition features with enhanced options:
  - `basePath: ['$defs']` for shared component organization
  - `$refStrategy: 'relative'` for better reusability
  - `target: 'jsonSchema2020-12'` for latest JSON Schema specification
- **Automatic Schema Generation**: Single unified call generates comprehensive schemas with proper
  composition

### JSON Schema Optimizations

- **Centralized Primitives**: All reusable primitives (AwsAccountId, AwsRegion, ProjectName, etc.)
  centralized in `$defs` section
- **Enhanced Error Messages**: Comprehensive `errorMessage` properties with actionable guidance for
  developers
- **Strict Property Validation**:
  - `additionalProperties: false` at variant level
  - `unevaluatedProperties: false` at root level
  - Recursive strict validation throughout schema tree
- **Optimized Patterns**: Consistent validation patterns eliminate regex duplication

### TypeScript Type Generation Strategy

- **Primary Approach**: Runtime-validated types using `z.infer<typeof SchemaName>` for direct
  schema-to-type mapping
- **Secondary Approach**: Optional JSON Schema type generation using `json-schema-to-typescript`
- **Discriminated Union Types**: Both approaches produce equivalent, type-safe discriminated unions
- **Exhaustive Type Checking**: Full TypeScript support with automatic type narrowing

## 🏗️ Schema Architecture Improvements

### Zod Schema Refactoring

- **BaseSchema Composition**: Uses `.extend()` method instead of `.merge()` for cleaner composition
- **Field Consolidation**: Eliminated duplication by centralizing base fields in
  `ManifestBaseSchema`
- **Consistent Patterns**: All manifest schemas follow unified composition pattern

### Enhanced Primitives

- **AWS Resource Identifiers**: `AwsAccountId`, `AwsRegion`, `AwsArn` with enhanced validation
- **Project Identifiers**: `ProjectName`, `EnvCode` with strict formatting rules
- **Contact Information**: `EmailAddress`, `CompanyName` with comprehensive validation
- **AWS Properties**: `TagMap`, `VpcCidr` with AWS-compliant patterns

## 🧹 Code Quality Improvements

### Deprecated Code Removal

- **Eliminated Duplicates**: Removed deprecated `AnyManifestSchema` and `AnyManifestConfig`
- **Unified References**: All code now uses main `ManifestSchema` and `Manifest` type
- **Consistent Validation**: Single source of truth for all manifest validation

### Build Optimizations

- **Reduced Bundle Size**: Eliminated duplicate code and unused imports
- **Enhanced Performance**: Optimized schema generation with better caching
- **Improved Type Safety**: Stricter TypeScript compilation with no deprecated references

## 📚 Documentation & Examples

### Comprehensive Guides

- **Type Generation Strategy**: Complete documentation with practical examples
- **JSON Schema Optimizations**: Detailed implementation guidelines
- **Migration Guidance**: Clear deprecation notices and upgrade paths

### Practical Examples

- **Type-Safe Processing**: Discriminated union examples with exhaustive checking
- **Validation Patterns**: Runtime validation with detailed error handling
- **Schema References**: Proper usage of centralized primitives

## 🔧 Technical Implementation

### Enhanced Generation Process

1. **Zod to JSON Schema**: Uses `zodToJsonSchema` with optimized settings
2. **Primitive Injection**: Adds comprehensive `$defs` library
3. **Strict Validation**: Applies `applyStrictValidationRules` recursively
4. **Error Enhancement**: Adds detailed error messages throughout

### Generated Schema Quality

- **3,579+ lines** of comprehensive validation rules
- **Centralized primitives** eliminate pattern duplication
- **Enhanced error messages** provide actionable guidance
- **Strict validation** prevents typos and unexpected properties

## 🎉 Benefits Achieved

### For Developers

- **Better IDE Support**: Rich tooltips and validation messages
- **Faster Debugging**: Clear error messages explain validation failures
- **Prevented Errors**: Strict validation catches typos and unexpected properties

### For Runtime Validation

- **Comprehensive Coverage**: No unexpected properties can slip through
- **Actionable Errors**: Error messages guide users to correct solutions
- **Consistent Patterns**: Centralized primitives ensure uniform validation

### For Maintenance

- **Single Source of Truth**: Primitives defined once, used everywhere
- **Easy Updates**: Change validation rules in one location
- **Reduced Duplication**: No repeated regex patterns or validation logic

This release establishes a robust, enterprise-grade foundation for schema-driven development across
all CodeIQLabs projects, ensuring excellent developer experience while maintaining strict validation
and comprehensive type safety.
