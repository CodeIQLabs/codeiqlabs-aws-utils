# Prettier Configuration

## 📦 Centralized Configuration

This repository uses **centralized Prettier configuration** from the
`@codeiqlabs/eslint-prettier-config` shared library.

### ⚠️ Important Notes

- **No local `.prettierrc` files**: Configuration comes from the shared package
- **Consistent across all CodeIQLabs projects**: Same formatting rules everywhere
- **Automatic updates**: Configuration updates when the shared package is updated

### 🔧 Configuration Source

```json
{
  "devDependencies": {
    "@codeiqlabs/eslint-prettier-config": "^1.5.0",
    "prettier": "^3.0.0"
  }
}
```

The Prettier configuration is automatically loaded from the `@codeiqlabs/eslint-prettier-config`
package, which provides:

- Consistent formatting rules across all CodeIQLabs repositories
- Centralized maintenance and updates
- Shared ignore patterns and file associations

### 📋 Available Scripts

```bash
# Format all files
npm run format

# Check formatting (used in CI/CD)
npm run format:check
```

### 🚨 CI/CD Considerations

When debugging formatting issues between local and CI/CD environments:

1. **Line Endings**: Windows (CRLF) vs Linux (LF) differences
2. **File Generation**: Schema files generated during build may have different formatting
3. **Package Versions**: Ensure same Prettier version in both environments
4. **Configuration Resolution**: Verify shared config is properly loaded

### 🔍 Debugging Format Issues

```bash
# Check which files have formatting issues
npm run format:check

# Fix formatting issues
npm run format

# Verify configuration is loaded correctly
npx prettier --find-config-path .
```

For more details about the centralized configuration, see the
[@codeiqlabs/eslint-prettier-config](../codeiqlabs-eslint-prettier-config) repository.
