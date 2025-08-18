---
'@codeiqlabs/aws-cdk': patch
---

fix: resolve GitHub Packages authentication issues in CI/CD workflows

- Added explicit permissions (contents: read, packages: read) to CI workflow
- Enhanced .npmrc configuration with always-auth=true and trailing slash for registry URL
- Updated all dependency installation steps to explicitly configure npmrc with authentication token
- Fixed 403 Forbidden errors when accessing @codeiqlabs/eslint-prettier-config from GitHub Packages
- Ensured proper authentication setup for all workflow jobs (prettier, tests, changeset-check)

This resolves the "Permission permission_denied: read_package" error that was preventing CI workflows from installing the centralized eslint-prettier-config package.
