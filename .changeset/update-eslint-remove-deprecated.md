---
"@codeiqlabs/aws-utils": minor
---

Update eslint-prettier-config and remove deprecated functions

- Update `@codeiqlabs/eslint-prettier-config` to ^1.6.0 for improved JavaScript file handling
- Remove deprecated loader functions: `validateConfig`, `loadManagementManifest`, `loadWorkloadManifest`
- Clean up unused imports in config modules (glob, join from path)
- Streamline configuration loading utilities for better maintainability
- Remove unused dependencies and simplify module structure

This release improves compatibility with the latest ESLint configuration and removes legacy functions that are no longer needed.
