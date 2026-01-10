---
"@codeiqlabs/aws-utils": minor
---

### Convention-over-Configuration Schema Refactoring

**Breaking Changes:**
- Removed `deployment` field from UnifiedAppConfig - use `environments` instead (at least one environment required)
- Removed `enabled: true` flags from all component schemas - presence implies enabled
- Identity Center `assignments` now uses compact map format: `{ accountKey: { permissionSet: [userKeys] } }`
- GitHub OIDC `environments` replaced with `targetEnvironments` string array referencing environment keys

**New Features:**
- Added `saasEdge` schema for CloudFront/S3 distributions (customization-aws)
- Added `saasWorkload` schema for ECS/Aurora services (saas-aws)
- Added `infrastructure` section for VPC/ALB configuration in customization-aws
- Added `skipEnvironmentName` to NamingConfigSchema for single-account repos
- Added `StackNameOptions.skipEnvironment` for stack name generation without environment segment
- Added `defaults` section for ECS/Aurora default configurations

**Schema Changes:**
- `SaasAppSchema` - Brand/application definition with marketingOnly, hasApi, hasWebapp flags
- `SaasEdgeAppSchema` - CloudFront distribution types (marketing, webapp, api)
- `SaasWorkloadAppSchema` - ECS service types with Stripe configuration
- `CompactAssignmentsMapSchema` - Human-friendly Identity Center assignment format
