---
inclusion: always
---

# AWS Utils Library Build Guidelines

## Overview

This is the foundational shared library providing:

- Naming utilities
- Validation schemas
- Configuration helpers
- Constants

Consumed by:

- `codeiqlabs-aws-cdk`
- `codeiqlabs-management-aws`
- `codeiqlabs-customization-aws`
- `codeiqlabs-saas-aws`

## Build Process

### Build Command

```bash
pnpm run build
```

This runs:

1. TypeScript compilation (`tsc`)
2. Generates `dist/` directory

### Watch Mode

```bash
pnpm run watch
```

## After Making Changes

**CRITICAL**: This is the FIRST library in the dependency chain. After ANY change:

1. **Build this library**:

```bash
cd codeiqlabs-aws-utils
pnpm run build
```

2. **Build dependent library** (aws-cdk):

```bash
cd ../codeiqlabs-aws-cdk
pnpm install
pnpm run build
```

3. **Reinstall in consuming repos**:

```bash
cd ../codeiqlabs-saas-aws
pnpm install
```

## Dependency Chain

```
codeiqlabs-aws-utils (build first)
    ↓
codeiqlabs-aws-cdk (build second)
    ↓
codeiqlabs-*-aws (reinstall third)
```

## Package Structure

```
codeiqlabs-aws-utils/
├── src/
│   ├── naming/         # Resource naming utilities
│   ├── constants/      # Shared constants
│   ├── helpers/        # Helper functions
│   ├── tagging/        # Tagging utilities
│   ├── config/         # Configuration schemas
│   ├── application/    # Application orchestrators
│   ├── cli/            # CLI utilities
│   └── index.ts        # Public exports
├── dist/               # Compiled output (gitignored)
├── package.json
└── tsconfig.json
```

## Exports

All public APIs are exported from `src/index.ts`:

```typescript
// Naming
export * from './naming';

// Constants
export * from './constants';

// Helpers
export * from './helpers';

// Config
export * from './config';
```

## Testing

### Run Tests

```bash
pnpm test
```

### Test Coverage

```bash
pnpm test:coverage
```

## Linting

### Run Linter

```bash
pnpm lint
```

### Fix Linting Issues

```bash
pnpm lint:fix
```

## Versioning

Uses semantic versioning:

- **Major**: Breaking changes to public API
- **Minor**: New features (backward compatible)
- **Patch**: Bug fixes

## Anti-Patterns

- ❌ Don't skip rebuilding after changes
- ❌ Don't forget to rebuild aws-cdk after utils changes
- ❌ Don't commit `dist/` directory
- ❌ Don't export internal utilities
- ❌ Don't break backward compatibility without major version bump
