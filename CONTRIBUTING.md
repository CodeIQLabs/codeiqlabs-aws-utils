# Contributing to @codeiqlabs/aws-utils

## Development Workflow

### Making Changes

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Update source files in `src/`
   - Add tests if applicable
   - Update documentation

3. **Test your changes**

   ```bash
   npm run build
   npm run test:all
   npm run format:check
   ```

4. **Create a changeset**

   ```bash
   npm run changeset
   ```

   - Select the appropriate change type (patch/minor/major)
   - Write a clear, descriptive summary
   - See `.changeset/RELEASE_TEMPLATE.md` for guidance

5. **Commit and push**

   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - The CI workflow will automatically validate your changes
   - Ensure you have included a changeset file
   - Wait for review and approval

### Release Process

The release process is fully automated:

1. **Pull Request Merged** → Triggers release workflow
2. **Changesets Action** either:
   - Creates/updates a "Version Packages" PR (if changesets exist)
   - Publishes the package (if Version Packages PR was merged)

### Changeset Guidelines

#### When to create changesets:

- **Patch**: Bug fixes, documentation updates, internal refactoring
- **Minor**: New features, new utilities, additive changes
- **Major**: Breaking changes, removed features, changed APIs

#### For Patch Releases (Bug Fixes)

```
fix: [brief description]

- Fixed [specific issue]
- Resolved [specific problem]
- Updated [specific component] to handle [specific case]
```

#### For Minor Releases (New Features)

```
feat: [brief description]

- Added [new feature/utility/configuration]
- Enhanced [existing functionality]
- Improved [specific aspect]
```

#### For Major Releases (Breaking Changes)

```
BREAKING: [brief description]

- **BREAKING**: [specific breaking change]
- **Migration**: [how to migrate]
- Removed [deprecated feature]
- Changed [behavior] from [old] to [new]
```

### Scripts Reference

```bash
# Development
npm run build          # Build the package (dual ESM/CJS)
npm run watch          # Watch for changes
npm run test:all       # Run tests

# Code Quality
npm run format         # Format code
npm run format:check   # Check formatting
npm run lint           # Lint code
npm run lint:fix       # Fix linting issues

# Changesets
npm run changeset           # Create a new changeset
npm run changeset:version   # Preview version changes
npm run changeset:status    # Check changeset status
npm run changeset:check     # Count changeset files

# Release (automated via CI)
npm run release       # Publish and push tags
```

### Schema Development Guidelines

When adding new schemas:

1. **Follow CDK alignment** - Create new files that correspond to AWS services
2. **Use centralized validation** - Import base schemas instead of creating inline regex
3. **Maintain backward compatibility** - Export new schemas through the main index
4. **Document your changes** - Update README with new schema files

### Troubleshooting

#### "No changeset found" error in CI

- You need to create a changeset for your changes
- Run `npm run changeset` and commit the generated file

#### Build failures

- Ensure TypeScript compiles for both ESM and CJS targets
- Check that all imports use proper file extensions for ESM compatibility
- Verify that tests pass for both module formats
